//
//  EventEditor.swift
//  eventU
//
//  Created by Alexandra Brown on 7/6/21.
//

import SwiftUI
import MapKit
import Alamofire

struct EventEditor: View {
    @EnvironmentObject var modelData: ModelData
    @Binding var event: Event
    
    @State private var active: Bool = false
    @State private var incomplete: Bool = false
    @State private var validLoc: Bool = true
    @State private var badEvent: Bool = false
    @State private var badDel: Bool = false
    @State private var delete: Bool = false
    
    
    var body: some View {
        Form {
            Text("Please Press Save to Update")
            Section(header: Text("Title")) {
                TextField("Event Title", text: $event.title)
            }
            
            
            if validLoc == false {
                Text("Please enter a valid location")
                    .foregroundColor(.red)
            }
            Section(header: Text("Address")) {
                TextField("Name", text: $event.name)
                TextField ("Street", text: $event.street)
                TextField("City", text: $event.city)
                TextField("State", text: $event.state)
            }
            Section(header: Text("Date & Time")) {
                DatePicker(
                    "Start Time",
                    selection: $event.startTime,
                    displayedComponents: [.date, .hourAndMinute]
                )
            
                DatePicker(
                    "End Time",
                    selection: $event.endTime,
                    displayedComponents: [.date, .hourAndMinute]
                )
            }
            Section(header: Text("Category")) {
                Text(event.category.rawValue)
                Picker("Category", selection: $event.category) {
                    ForEach(Category.allCases, id: \.id) { cat in
                        Image(systemName: cat.image).tag(cat.rawValue)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
            }
            
            Section(header: Text("Capacity")) {
                TextField(
                    "Capacity",
                    text: $event.capacity)
                    .keyboardType(.numberPad)
            }
            Section(header: Text("Description")) {
                TextEditor(text: $event.description)
            }
            
            Group {
                if badEvent == true {
                    Text("Error updating event. Please try again.")
                        .foregroundColor(.red)
                }
                if incomplete == true {
                    Text("Please fill in all fields.")
                        .foregroundColor(.red)
                }
                if badDel == true {
                    Text("Error deleting event. Please try again.")
                }
            }
            HStack {
                Button(action: {
                    },
                        label: {
                        Text("Save")
                            .padding()
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                            .foregroundColor(.white)
                            .cornerRadius(40)
                    })
                    .onTapGesture {
                        print("update")
                        updateEvent()
                    }
                
                Button(action: {
                    },
                        label: {
                        HStack{
                            Text("Delete")
                            Image(systemName: "trash")
                        }
                            .padding()
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .background(Color.red)
                            .foregroundColor(.white)
                            .cornerRadius(40)
                    })
                .onTapGesture {
                    delete = true
                }
                    .alert(isPresented: $delete) {
                        Alert(title: Text("Delete Event"),
                                message: Text("Are you sure you want to delete this event?"),
                                primaryButton: .default(
                                    Text("Cancel")
                                ),
                                secondaryButton: .destructive(
                                    Text("Delete"),
                                    action: {
                                        deleteEvent()
                                    }
                                ))
                    }
            }
        }
    }
    func updateEvent() {
            let fullAddr = "\(event.street), \(event.city), \(event.state)"
            
            let geocoder = CLGeocoder()

            geocoder.geocodeAddressString(fullAddr, completionHandler: {(placemarks, error) -> Void in
               if((error) != nil){
                validLoc = false
               }
               if let placemark = placemarks?.first {
                    validLoc = true
                    let coords = placemark.location!.coordinate
                
                    let eventInd = modelData.events.firstIndex(where: {$0.objId == self.event.objId})
                    modelData.events[eventInd!].lat = coords.latitude
                    modelData.events[eventInd!].long = coords.longitude
                  }
                })

    }
    struct delEvent: Encodable {
        var _id: String
    }
    func deleteEvent() {
        let del = delEvent.init(_id: event.objId)
        AF.request("https://event-u.herokuapp.com/api/events/delete",
                    method: .post,
                    parameters: del,
                    encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                        print(response)
                        if response.response?.statusCode == 200
                        {
                            var eventInd = modelData.events.firstIndex(where: {$0.objId == self.event.objId})
                            modelData.events[eventInd!].deleted = 1
                            eventInd = modelData.curEvents.firstIndex(where: {$0.objId == self.event.objId})
                            modelData.curEvents[eventInd!].deleted = 1
                            modelData.curEvents.remove(at: eventInd!)
                            active = true
                            
                        } else {
                            badDel = true
                        }
                    }
    }
}


struct EventEditor_Previews: PreviewProvider {
    static var previews: some View {
       EventEditor(event: .constant(.default))
        .environmentObject(ModelData())
    }
}
