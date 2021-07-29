//
//  ProfileHost.swift
//  eventU
//
//  Created by Alexandra Brown on 7/19/21.
//

import SwiftUI
import Alamofire

struct ProfileHost: View {
    @EnvironmentObject var modelData: ModelData
    @State private var draftProfile = User.default
    @State private var editMode = EditMode.inactive
    
    
    @State private var badEdit: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                if editMode == EditMode.active {
                    Button("Cancel") {
                        draftProfile = modelData.user
                        editMode = EditMode.inactive
                    }
                }
                Spacer()
                EditButton()
            }

            if editMode == EditMode.inactive {
                Profile()
                    .environmentObject(modelData)
                    .navigationBarHidden(true)
            } else {
                ProfileEditor(profile: $draftProfile)
                    .environmentObject(modelData)
                    .navigationBarHidden(true)
                    .onAppear {
                        draftProfile = modelData.user
                    }
                    .onDisappear {
                        if modelData.user.preferences != draftProfile.preferences {
                            prefAPI()
                        }
                        if modelData.user.username != draftProfile.username {
                            changeCreated()
                        }
                        modelData.user = draftProfile
                        callAPI()
                    }
            }
        }
        .environment(\.editMode, $editMode)
        .animation(.spring(response: 0))
        .padding()
    }
    
    func changeCreated() {
        var ind: Int = 0
        for event in modelData.events {
            if event.createdBy == modelData.user.username {
                modelData.events[ind].createdBy = draftProfile.username
                updateAPI(event: event)
            }
            ind += 1
        }
    }
    
    func updateAPI(event: Event) {
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
        
        
        let payload = EventPayload.init(title: event.title, category: event.category.rawValue, address: fullAddr, lat: event.lat, long: event.long, startTime: startStr, endTime: endStr, createdBy: draftProfile.username, description: event.description, capacity: Int(event.capacity)!)
        let ed = Edits.init(event: event.objId, editPayload: payload)
        
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
    struct EventPayload: Encodable {
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
        var editPayload: EventPayload
    }
    
    struct Payload: Encodable {
        var firstName: String
        var lastName: String
        var email: String
        var username: String
        var password: String
    }
    struct EditUser: Encodable {
        var _id: String
        var profile: Payload
    }
    func callAPI() {
        var userDict = UserDefaults.standard.dictionary(forKey: "user")
        userDict!["firstName"] = modelData.user.firstName
        userDict!["lastName"] = modelData.user.lastName
        userDict!["email"] = modelData.user.email
        userDict!["username"] = modelData.user.username
        UserDefaults.standard.setValue(userDict, forKey: "user")
        let payload = Payload.init(firstName: modelData.user.firstName, lastName: modelData.user.lastName, email: modelData.user.email, username: modelData.user.username, password: "")
        let ed = EditUser.init(_id: modelData.user.objId, profile: payload)
        AF.request("https://event-u.herokuapp.com/api/users/editUser",
                    method: .post,
                    parameters: ed,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                        if response.response?.statusCode != 200 {
                            badEdit = true
                        }
                }
    }
    struct Preference: Encodable {
        var username: String
        var preferences: [String]
    }
    
    func prefAPI() {
        var prefArr: [String] = []
        for cat in draftProfile.preferences {
            prefArr.append(cat.rawValue)
        }
        var userDict = UserDefaults.standard.dictionary(forKey: "user")
        userDict!["preferences"] = prefArr
        UserDefaults.standard.setValue(userDict, forKey: "user")
        let pref = Preference.init(username: modelData.user.username, preferences: prefArr)
        AF.request("https://event-u.herokuapp.com/api/users/preferences",
                    method: .post,
                    parameters: pref,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                        if response.response?.statusCode != 200 {
                            self.badEdit = true
                        }
                }
    }
}

struct ProfileHost_Previews: PreviewProvider {
    static var previews: some View {
        ProfileHost()
            .environmentObject(ModelData())
    }
}
