//
//  tabs.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//

import SwiftUI
import Alamofire

struct tabs: View {
    @EnvironmentObject var modelData: ModelData
    
    var tabNum: Int
    @State var selectedTab: Int = 0
    
    
    var body: some View {
        TabView(selection: $selectedTab) {
            Home().environmentObject(modelData)
                .navigationBarHidden(true)
                .tabItem {
                    Image(systemName: "house")
                }
                .tag(0)
            Add().environmentObject(modelData)
                
                .navigationBarHidden(true)
                .tabItem {
                    Image(systemName: "plus.square")
                }
                .tag(1)
            ProfileHost().environmentObject(modelData)
                .navigationBarHidden(true)
                .tabItem {
                    Image(systemName: "person.crop.circle")
                }
                .tag(2)
        }
        .onAppear {
            selectedTab = tabNum
            if modelData.user == User.default {
                setUser()
            }
        }
    }
    func setUser(){
        let userDict = UserDefaults.standard.dictionary(forKey: "user")
        var cats: [Category] = []
        for pref in userDict!["preferences"] as! [String] {
            cats.append(Category.init(rawValue: pref)!)
        }
        let cur = User.init(id: 0, objId: userDict!["objId"] as! String, username: userDict!["username"] as! String, firstName: userDict!["firstName"] as! String, lastName: userDict!["lastName"] as! String, email: userDict!["email"] as! String, preferences: cats, likedEvents: userDict!["likedEvents"] as! [String], attendedEvents: userDict!["attendedEvents"] as! [String], activationCode: userDict!["activationCode"] as! Int)
        modelData.user = cur
    }
}

struct tabs_Previews: PreviewProvider {
    static var previews: some View {
        tabs(tabNum: 0)
            .environmentObject(ModelData())
    }
}
