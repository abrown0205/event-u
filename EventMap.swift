//
//  EventMap.swift
//  eventU
//
//  Created by Alexandra Brown on 6/30/21.
//

import SwiftUI
import MapKit
import CoreLocation


struct EventMap: View {
    @EnvironmentObject var modelData: ModelData
    
    @State private var location: CLLocationCoordinate2D?
    @State private var region = MKCoordinateRegion()
    @State private var color = Color(.black)
    @State private var filter: String = ""
    @State var annotations: [loc] = []
    
    
    var body: some View {
        NavigationView {
            VStack {
                HStack {
                    Spacer()
                    Picker("Filter", selection: $filter) {
                        Text("All Categories").tag("")
                        ForEach(Category.allCases, id: \.id) { cat in
                            Text(cat.rawValue).tag(cat.rawValue)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                    .padding()
                }
                Map(coordinateRegion: $region, annotationItems: annotations) { annotation in
                    MapAnnotation(coordinate: annotation.coord, anchorPoint: CGPoint(x: 0.5, y: 0.5)) {
                            VStack {
                                if filter != "" {
                                    if annotation.event.category.rawValue == filter {
                                        NavigationLink( destination: EventHost(event: annotation.event, fromProfile: false).environmentObject(modelData),
                                            label: {
                                                Image(systemName: "mappin")
                                                    .font(.title)
                                                    .foregroundColor(annotation.color)
                                            })
                                    }
                                } else {
                                    NavigationLink( destination: EventHost(event: annotation.event, fromProfile: false).environmentObject(modelData),
                                        label: {
                                            Image(systemName: "mappin")
                                                .font(.title)
                                                .foregroundColor(annotation.color)
                                        }
                                    )
                                }
                            }
                        }
                    }
                    .onAppear() {
                        getAnnotations()
                        setRegion(CLLocationCoordinate2D(latitude: 28.59419822692871, longitude: -81.20557403564453)) // Coords of UCF
                    }
                .ignoresSafeArea()
            }
         }
    }
    
    private func setRegion(_ coordinate: CLLocationCoordinate2D) {
        self.region = MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1))
    }
    
    struct loc: Identifiable {
        let id = UUID()
        let name: String
        let coord: CLLocationCoordinate2D
        let color: Color
        let event: Event
        var show: Bool
    }
    private func getAnnotations() {
        let user = modelData.user
        for event in modelData.curEvents {
            if event.createdBy == user.username {
                self.color = Color.yellow
            } else {
                self.color = Color.black
            }
            self.location = CLLocationCoordinate2D(latitude: event.lat, longitude: event.long)
            annotations.append(loc(name: event.title, coord: self.location!, color: self.color, event: event, show: false))
        }
    }
}


struct EventMap_Previews: PreviewProvider {
    static var events = ModelData().events
    
    static var previews: some View {
        EventMap()
            .environmentObject(ModelData())
    }
}
