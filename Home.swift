//
//  Home.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//


import SwiftUI
import UIKit
import Alamofire

struct Home: View {
    @EnvironmentObject var modelData: ModelData
    @State private var viewStyle: Int = 1
    
    var body: some View {
        VStack {
            Picker(selection: $viewStyle, label: Text("View"), content: {
                Image(systemName: "list.bullet").tag(1)
                Image(systemName: "map").tag(2)
                Image(systemName: "calendar").tag(3)
                }
            )
            .pickerStyle(SegmentedPickerStyle())
            Text("Events Near U")
                .font(.title)
                .bold()
            Spacer()
            
            if viewStyle == 1 {
                EventList()
                    .environmentObject(modelData)
                    .navigationBarHidden(true)
            }
            else if viewStyle == 2 {
                EventMap()
                    .environmentObject(modelData)
                    .navigationBarHidden(true)
            }
            else if viewStyle == 3 {
                EventCal(date: Date())
                    .environmentObject(modelData)
                    .navigationBarHidden(true)
            }
        }
    }
}


struct Home_Previews: PreviewProvider {
    static var previews: some View {
        Home()
            .environmentObject(ModelData())
    }
}


