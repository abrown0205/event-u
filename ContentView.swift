//
//  ContentView.swift
//  eventU
//
//  Created by Alexandra Brown on 6/28/21.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            if 0 != 0{
                signup()
                    .navigationBarHidden(true)
                    .environmentObject(ModelData())
            }
            else if((UserDefaults.standard.integer(forKey: "loggedIn")) == 1) {
                tabs(tabNum: 0)
                    .navigationBarHidden(true)
                    .environmentObject(ModelData())
            }
            else {
                signup()
                    .navigationBarHidden(true)
                    .environmentObject(ModelData())
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
        }
    }
}
