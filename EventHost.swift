//
//  EventHost.swift
//  eventU
//
//  Created by Alexandra Brown on 7/6/21.
//

import SwiftUI
import Alamofire

struct EventHost: View {
    @EnvironmentObject var modelData: ModelData
    @State var event: Event
    @State var fromProfile: Bool
    
    @State private var badEdit: Bool = false
    @State private var draftEvent = Event.default
    @State private var editMode = EditMode.inactive
    @State private var active: Bool = false
    

    var body: some View {
        NavigationView {
            let eventInd = modelData.events.firstIndex(where: {$0.objId == self.event.objId})
            if eventInd != nil {
                VStack(alignment: .leading, spacing: 20) {
                    HStack {
                        if editMode == EditMode.active {
                            Button("Cancel") {
                                draftEvent = modelData.events[eventInd!]
                                editMode = EditMode.inactive
                            }
                        }
                        Spacer()
                        if modelData.events[eventInd!].createdBy == modelData.user.username {
                            EditButton()
                        }
                        else {
                            Text("Posted By: \(self.event.createdBy)")
                        }
                    }
                    if self.badEdit {
                        Text("Error updating event. Please try again.")
                            .foregroundColor(.red)
                    }
                    
                    if editMode == EditMode.inactive  && eventInd != nil && active == false{
                        EventDetail(curEvent: modelData.events[eventInd!])
                            .environmentObject(self.modelData)
                    } else if active == false {
                        EventEditor(event: $draftEvent)
                            .environmentObject(modelData)
                            .onAppear {
                                draftEvent = modelData.events[eventInd!]
                            }
                            .onDisappear {
                                if eventInd != nil {
                                    if eventInd! < modelData.events.count && modelData.events[eventInd!].deleted == 0 {
                                        modelData.events[eventInd!] = draftEvent
                                        event = modelData.events[eventInd!]
                                        callAPI()
                                    } else {
                                        active = true
                                    }
                                }
                            }
                    }
                }
                .navigationBarHidden(true)
                .environment(\.editMode, $editMode)
                .animation(.spring(response: 0))
                .padding()
                }
        }
        .fullScreenCover(isPresented: $active, content: {
         tabs(tabNum: 0)
         .environmentObject(modelData)
        })

    }
    func callAPI() {
        var fullAddr = ""
        if(event.name == "") {
            fullAddr = "\(event.street), \(event.city), \(event.state)"
        } else {
            fullAddr = "\(event.name), \(event.street), \(event.city), \(event.state)"
        }
        
        let cal = Calendar.current
        var month = ""
        var day = ""
        var hour = ""
        var min = ""
        let startComp = cal.dateComponents([.month, .day, .year, .hour, .minute], from: event.startTime)
        
        if startComp.month! < 10 {
            month = "0\(startComp.month!)"
        } else {
            month = "\(startComp.month!)"
        }
        if startComp.day! < 10 {
            day = "0\(startComp.day!)"
        } else {
            day = "\(startComp.day!)"
        }
        if startComp.hour! < 10 {
            hour = "0\(startComp.hour!)"
        } else {
            hour = "\(startComp.hour!)"
        }
        if startComp.minute! < 10 {
            min = "0\(startComp.minute!)"
        } else {
            min = "\(startComp.minute!)"
        }
        
        let startStr = "\(startComp.year!)-\(month)-\(day)T\(hour):\(min)"
        
        let endComp = cal.dateComponents([.month, .day, .year, .hour, .minute], from: event.endTime)
        
        if endComp.month! < 10 {
            month = "0\(endComp.month!)"
        } else {
            month = "\(endComp.month!)"
        }
        if endComp.day! < 10 {
            day = "0\(endComp.day!)"
        } else {
            day = "\(endComp.day!)"
        }
        if endComp.hour! < 10 {
            hour = "0\(endComp.hour!)"
        } else {
            hour = "\(endComp.hour!)"
        }
        if endComp.minute! < 10 {
            min = "0\(endComp.minute!)"
        } else {
            min = "\(endComp.minute!)"
        }
        
        let endStr = "\(endComp.year!)-\(month)-\(day)T\(hour):\(min)"
        
        
        let payload = Payload.init(title: event.title, category: event.category.rawValue, address: fullAddr, lat: event.lat, long: event.long, startTime: startStr, endTime: endStr, createdBy: event.createdBy, description: event.description, capacity: Int(event.capacity)!)
        let ed = Edits.init(event: event.objId, editPayload: payload)
        if event.deleted == 1 {
            return
        }
        AF.request("https://event-u.herokuapp.com/api/events/editevent",
                    method: .post,
                    parameters: ed,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                        if response.response?.statusCode != 200 {
                            badEdit = true
                        }
                }
    }
    struct Payload: Encodable {
        var title: String
        var category: String
        var address: String
        var lat: Double
        var long: Double
        var startTime: String
        var endTime: String
        var createdBy: String
        var description: String
        var capacity: Int
    }
    
    struct Edits: Encodable {
        var event: String
        var editPayload: Payload
    }
}

struct EventHost_Previews: PreviewProvider {
    static var previews: some View {
        EventHost(event: Event.default, fromProfile: false)
            .environmentObject(ModelData())
    }
}

