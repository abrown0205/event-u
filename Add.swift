//
//  Add.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//


import SwiftUI
import Alamofire
import CoreLocation

struct Add: View {
    @EnvironmentObject var modelData: ModelData
    @State private var validLoc: Bool = true
    @State private var badEvent: Bool = false
    @State private var incomplete: Bool = false
    @State private var success: Bool = false
    
    @State private var title: String = ""
    @State private var category: String = ""
    @State private var name: String = ""
    @State private var street: String = ""
    @State private var city: String = ""
    @State private var state: String = ""
    @State private var start: Date = Date()
    @State private var end: Date = Date()
    @State private var capacity: String = ""
    @State private var description: String = ""
    
    
    var body: some View {
            VStack {
                Text("Add an Event")
                    .font(.title)
                    .bold()
                Form {
                    if validLoc == false {
                        Text("Please enter a valid location")
                            .foregroundColor(.red)
                    }
                    Section(header: Text("Title")) {
                        TextField(
                            "Event Title",
                            text: $title)
                    }
                    Section(header: Text("Address")) {
                        TextField (
                            "Name",
                            text: $name)
                        TextField (
                            "Street",
                            text: $street)
                    
                        TextField(
                            "City",
                            text: $city)
                        TextField(
                            "State",
                            text: $state)
                    }
                    Section(header: Text("Date & Time")) {
                        DatePicker(
                            "Start Time",
                            selection: $start,
                            displayedComponents: [.date, .hourAndMinute]
                        )
                    
                        DatePicker(
                            "End Time",
                            selection: $end,
                            displayedComponents: [.date, .hourAndMinute]
                        )
                    }
                    Section(header: Text("Category")) {
                        Text(category)
                        Picker("Category", selection: $category) {
                            ForEach(Category.allCases, id: \.id) { cat in
                                Image(systemName: cat.image).tag(cat.rawValue)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                    }
                    
                    Section(header: Text("Capacity")) {
                        TextField(
                            "Capacity",
                            text: $capacity)
                            .keyboardType(.numberPad)
                    }
                    Section(header: Text("Description")) {
                        TextEditor(text: $description)
                    }
                    
                    Group {
                        if badEvent == true {
                            Text("Error adding event. Please try again.")
                                .foregroundColor(.red)
                        }
                        if incomplete == true {
                            Text("Please fill in all fields.")
                                .foregroundColor(.red)
                        }
                    
                        Button(action: {
                            createEvent()
                            },
                               label: {
                                Text("Create")
                                    .padding()
                                    .frame(minWidth: 0, maxWidth: .infinity)
                                    .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                                    .foregroundColor(.white)
                                    .cornerRadius(40)
                        })
                        if success == true {
                            Text("Event Created!")
                                .bold()
                        }
                    }
                }
            }
            .navigationBarHidden(true)
        
    }
    
    struct new: Encodable {
        var id: Int
        var title: String
        var category: String
        var address: String
        var lat: Double
        var long: Double
        var startTime: String
        var endTime: String
        var description: String
        var likes: Int
        var createdBy: String
        var capacity: Int
    }
    
    func createEvent() {
        self.success = false
        let cal = Calendar.current
        let user = modelData.user
        var coords: CLLocationCoordinate2D = CLLocationCoordinate2D()
        let count = modelData.events.count
        
        var month: String
        var day: String
        var hour: String
        var min: String
        
        
        if(self.title == "" || self.street == "" || self.city == "" || self.state == "" || self.category == "" || self.start == Date() || self.end == Date() || self.capacity == "" || self.description == "")
        {
            incomplete = true
            return
        } else {
            incomplete = false
        }
        

            
        let startComp = cal.dateComponents([.month, .day, .year, .hour, .minute], from: self.start)
        
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
        
        let endComp = cal.dateComponents([.month, .day, .year, .hour, .minute], from: self.end)
        
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
        
        var fullAddr = "\(self.street), \(self.city), \(self.state)"
        let geocoder = CLGeocoder()

        geocoder.geocodeAddressString(fullAddr, completionHandler: {(placemarks, error) -> Void in
           if((error) != nil){
            validLoc = false
           }
           if let placemark = placemarks?.first {
                validLoc = true
                coords = placemark.location!.coordinate
                
            if name != "" {
                    fullAddr = "\(self.name), \(fullAddr)"
            }
            var newEvent = Event(id: count, objId: "", title: self.title, category: Category.init(rawValue: self.category)!, name: name, street: street, city: city, state: state, lat: coords.latitude, long: coords.longitude, startTime: start, endTime: end, description: self.description, likes: 0, createdBy: user.username, capacity: self.capacity, deleted: 0)
                let new = new.init(id: count, title: self.title, category: self.category, address: fullAddr, lat: coords.latitude, long: coords.longitude, startTime: startStr, endTime: endStr, description: self.description, likes: 0, createdBy: user.username, capacity: Int(self.capacity)!)
                AF.request("https://event-u.herokuapp.com/api/events/newevent",
                           method: .post,
                           parameters: new,
                           encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                            if response.error == nil {
                                self.badEvent = false
                                let JSON = response.value as! NSDictionary
                                newEvent.objId = JSON["_id"] as! String
                            } else {
                                self.badEvent = true
                                return
                            }
                        }
                modelData.events.append(newEvent)
                self.success = true
                clearFields()
            
              }
            })
    }
    
    
    func clearFields() {
        self.badEvent = false
        self.incomplete = false
        self.validLoc = true
        self.title = ""
        self.name = ""
        self.street = ""
        self.city = ""
        self.state = ""
        self.start = Date()
        self.end = Date()
        self.category = ""
        self.capacity = ""
        self.description = ""
    }
}

struct Add_Previews: PreviewProvider {
    static var previews: some View {
        Add()
            .environmentObject(ModelData())
    }
}
