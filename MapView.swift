//
//  MapView.swift
//  eventU
//
//  Created by Alexandra Brown on 6/30/21.
//

import SwiftUI
import MapKit
import CoreLocation

struct MapView: View {
    @EnvironmentObject var modelData: ModelData
    var event: Event
    
    @State private var location: CLLocationCoordinate2D?
    @State private var region = MKCoordinateRegion()
    @State private var annotations: [Event] = []
    @State private var color: Color = Color.black
    
    var body: some View {
        let user = modelData.user
        Map(coordinateRegion: $region, annotationItems: annotations) { annotation in
            MapAnnotation(coordinate: CLLocationCoordinate2D(latitude: annotation.lat, longitude: annotation.long), anchorPoint: CGPoint(x: 0.5, y: 0.5)) {
                    VStack{
                        Image(systemName: "mappin")
                            .font(.title)
                            .foregroundColor(color)
                    }
                }
            }
        .onAppear() {
            annotations.append(event)
            if event.createdBy == user.username {
                color = Color.yellow
            }
            setRegion(CLLocationCoordinate2D(latitude: event.lat, longitude: event.long))
        }
    }
    
    private func setRegion(_ coordinate: CLLocationCoordinate2D) {
        region = MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1))
    }
}

struct MapView_Previews: PreviewProvider {
    static var previews: some View {
        MapView(event: Event.default)
            .environmentObject(ModelData())
    }
}
