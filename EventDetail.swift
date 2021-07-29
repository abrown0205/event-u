//
//  EventDetail.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//

import SwiftUI
import CoreLocation

struct EventDetail: View {
    @EnvironmentObject var modelData: ModelData
    var curEvent: Event
    
    @State private var liked: Bool = false
    //@State private var attended: Bool = false
    
    var body: some View {
        let eventInd = modelData.events.firstIndex(where: {$0.objId == self.curEvent.objId})
        let event = modelData.events[eventInd!]
        
        let user: User = modelData.user
        ScrollView {
            HStack {
                Text(event.title)
                    .font(.title)
                    .bold()
                Spacer()
                Image(systemName: event.category.image)
            }
            .padding()
            .background(Color.yellow)
            .foregroundColor(.black)
            Divider()
            MapView(event: event)
                .environmentObject(modelData)
                .scaledToFill()
            
            HStack {
                VStack(alignment: .leading)
                {
                    HStack {
                        LikeButton(event: event, isSet: $liked)
                            .environmentObject(modelData)
                        Spacer()
                        /*AttendedButton(event: event, isSet: $attended)
                            .environmentObject(modelData)*/
                        
                    }
                    Divider()
                    Group {
                        Text("Location: ")
                            .font(.headline)
                        if event.name == "" {
                            Text("\(event.street), \n\(event.city), \(event.state)")
                                .scaledToFit()
                        } else {
                            Text("\(event.name), \n\(event.street), \n\(event.city), \(event.state)")
                                .scaledToFit()
                        }
                    }
                    
                    Group {
                        
                        let startStr = DateFormatter.localizedString(from: event.startTime, dateStyle: .medium, timeStyle: .short)
                        
                        Text("Date & Time:")
                            .font(.headline)
                        Text("\tStart: \(startStr)")
                        
                        let endStr = DateFormatter.localizedString(from: event.endTime, dateStyle: .medium, timeStyle: .short)

                        Text("\tEnd:   \(endStr)")
                    }
                    
                    Group {
                        Text("Description:")
                            .font(.headline)
                        Text("\t\(event.description)")
                        
                        Text("Capacity:")
                            .font(.headline)
                        Text("\t\(event.capacity)")
                    }
                    Spacer()
                }
                .padding(.horizontal)
                Spacer()
            }
            Spacer()
        }
        .onAppear(perform: {
           /* if(user.attendedEvents.contains(event.objId)) {
                attended = true
            }*/
            if(user.likedEvents.contains(event.objId)) {
                liked = true
            }
        })
    }
}

struct EventDetail_Previews: PreviewProvider {
    static var events = ModelData().events
    
    static var previews: some View {
        EventDetail(curEvent: events[0])
            .environmentObject(ModelData())
    }
}

