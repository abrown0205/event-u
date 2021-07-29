//
//  EventList.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//


import SwiftUI
import CoreLocation
import Alamofire

struct EventList: View {
    @EnvironmentObject var modelData: ModelData
    
    @State private var searchEvents: [Event] = []
    @State private var sort: Int = 3
    @State private var filter: String = ""
    @State private var prevFilter: String = ""
    
    var body: some View {
        NavigationView {
            VStack {
                HStack {
                    SearchBar(searchEvents: $searchEvents)
                      .environmentObject(modelData)
                    Picker("Sort", selection: $sort) {
                        Text("Category").tag(1)
                        Text("Name").tag(2)
                        Text("Time").tag(3)
                    }
                    .pickerStyle(MenuPickerStyle())
                    
                    Picker("Filter", selection: $filter) {
                        Text("All Categories").tag("")
                        ForEach(Category.allCases, id: \.id) { cat in
                            Text(cat.rawValue).tag(cat.rawValue)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                }
                .padding(.horizontal)
                if searchEvents == [Event.default] {
                    Text("No Results")
                }
                else if sort == 1 {
                    if searchEvents != [] {
                        List {
                            ForEach(modelData.categories.keys.sorted(), id: \.self) { key in
                                CatRow(catName: key, items: modelData.categories[key]!, fromSearch: true, searchEvents: searchEvents)
                                    .environmentObject(modelData)
                            }
                        }
                    } else if filter == "" {
                        SortCats().environmentObject(modelData)
                    } else {
                        if filter == "Sports" {
                            CatRow(catName: "Sports", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                                .environmentObject(modelData)
                                .navigationBarHidden(true)
                        } else if filter == "Music" {
                            CatRow(catName: "Music", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                                .environmentObject(modelData)
                                .navigationBarHidden(true)
                        } else if filter == "Studying" {
                            CatRow(catName: "Studying", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                                .environmentObject(modelData)
                                .navigationBarHidden(true)
                        }  else if filter == "Arts & Culture" {
                            CatRow(catName: "Arts & Culture", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                                .environmentObject(modelData)
                                .navigationBarHidden(true)
                        }
                        else if filter == "Shopping" {
                           CatRow(catName: "Shopping", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                               .environmentObject(modelData)
                               .navigationBarHidden(true)
                       }
                        else if filter == "Science" {
                           CatRow(catName: "Science", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                               .environmentObject(modelData)
                               .navigationBarHidden(true)
                       } else if filter == "Social" {
                            CatRow(catName: "Social", items: modelData.categories[self.filter] ?? [], fromSearch: false, searchEvents: [])
                            .environmentObject(modelData)
                            .navigationBarHidden(true)
                       }
                    }
                }
                else if sort == 2 {
                    ScrollView {
                        if searchEvents != [] {
                            ForEach(searchEvents.sorted(by: {$0.title < $1.title })) { event in
                                if event.deleted == 0 {
                                    NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                        EventRow(event: event)
                                    }
                                }
                            }
                        }
                        else if filter != "" {
                            ForEach(modelData.curEvents.sorted(by: { $0.title < $1.title })) { event in
                                if event.category.rawValue == filter {
                                    if event.deleted == 0 {
                                        NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                            EventRow(event: event)
                                        }
                                        .navigationBarHidden(true)
                                    }
                                }
                            }
                        } else {
                            ForEach(modelData.curEvents.sorted(by: { $0.title < $1.title })) { event in
                                if event.deleted == 0 {
                                    NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                        EventRow(event: event)
                                    }
                                    .navigationBarHidden(true)
                                }
                            }
                        }
                    }
                }
                else if sort == 3 {
                    ScrollView {
                        if searchEvents != [] {
                            ForEach(searchEvents.sorted(by: {$0.startTime < $1.startTime })) { event in
                                if event.deleted == 0 {
                                    NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                        EventRow(event: event)
                                    }
                                }
                            }
                        }
                        else if filter != "" {
                            ForEach(modelData.curEvents.sorted(by: { $0.startTime < $1.startTime })) { event in
                                if event.category.rawValue == filter {
                                    if event.deleted == 0 {
                                        NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                            EventRow(event: event)
                                        }
                                        .navigationBarHidden(true)
                                    }
                                }
                            }
                        } else {
                            ForEach(modelData.curEvents.sorted(by: { $0.startTime < $1.startTime })) { event in
                                if event.deleted == 0 {
                                    NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                        EventRow(event: event)
                                    }
                                    .navigationBarHidden(true)
                                }
                            }
                        }
                    }
                }
                Spacer()
            }
            .navigationBarHidden(true)
            .onAppear {
                modelData.events.removeAll(where: {$0.deleted == 1})
                modelData.curEvents.removeAll(where: {$0.deleted == 1})
                callAPI()
            }
        }
    }
    func callAPI() {
        var counter = 0
        var curCounter = 0
        let request  = AF.request("https://event-u.herokuapp.com/api/events/findevent")
        request.responseJSON { (data) in
            let JSON = data.value as! NSArray
            for event in JSON {
                let eventDic = event as! NSDictionary
                
                if modelData.events.contains(where: {$0.objId == eventDic["_id"] as! String})
                {
                    counter += 1
                    continue
                }
                
                var street = ""
                var city = ""
                var state = ""
                var name = ""
                var likes = 0
                
                let fullAddr = (eventDic["address"]! as! String).split(separator: ",")
                if (eventDic["address"]! as! String).first!.isNumber {
                    street = String(fullAddr[0])
                    city = String(fullAddr[1])
                    state = String(fullAddr[2])
                } else {
                    name = String(fullAddr[0])
                    street = String(fullAddr[1])
                    city = String(fullAddr[2])
                    state = String(fullAddr[3])
                }
                
                let startComp = (eventDic["startTime"] as! String).components(separatedBy: CharacterSet.init(arrayLiteral: ":", "-", "T"))
                let startDate = DateComponents(calendar: Calendar.current, timeZone: TimeZone.current, year: Int(startComp[0]), month: Int(startComp[1]), day: Int(startComp[2]), hour: Int(startComp[3]), minute: Int(startComp[4]))
                
                let endComp = (eventDic["endTime"] as! String).components(separatedBy: CharacterSet.init(arrayLiteral: ":", "-", "T"))
                let endDate = DateComponents(calendar: Calendar.current, timeZone: TimeZone.current, year: Int(endComp[0]), month: Int(endComp[1]), day: Int(endComp[2]), hour: Int(endComp[3]), minute: Int(endComp[4]))
                
                let capacity = "\(eventDic["capacity"] as! Int)"
                
                if eventDic["likes"] is NSNull  || eventDic["likes"] == nil{
                    likes = 0
                } else {
                    likes = eventDic["likes"] as! Int
                }
                
                let newEvent = Event.init(id: counter, objId: eventDic["_id"] as! String, title: eventDic["title"] as! String, category: Category.init(rawValue: eventDic["category"] as! String)!, name: String(name), street: String(street), city: String(city), state: String(state), lat: eventDic["lat"] as! Double, long: eventDic["long"] as! Double, startTime: startDate.date!, endTime: endDate.date!, description: eventDic["description"] as! String, likes: likes, createdBy: eventDic["createdBy"] as! String, capacity: capacity, deleted: 0)
                modelData.events.append(newEvent)
                counter += 1
                if newEvent.startTime >= Date() {
                    modelData.curEvents.append(newEvent)
                    curCounter += 1
                }
            }
           
        }
    }

}

struct EventList_Previews: PreviewProvider {
    static var previews: some View {
        EventList()
            .environmentObject(ModelData())
    }
}

