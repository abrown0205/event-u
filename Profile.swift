//
//  Profile.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//

import SwiftUI

struct Profile: View {
    @EnvironmentObject var modelData: ModelData
    @State private var active: Bool = false
    @State private var showEvent: Bool = false
    @State private var changePW: Bool = false
    
    
    var body: some View {
        NavigationView {
            let user = modelData.user
            VStack(alignment: .leading) {
                HStack {
                    Text("\(user.firstName) \(user.lastName)")
                        .font(.title)
                        .bold()
                    Spacer()
                }
                Divider()
                List {
                    Section(header: Text("Login Information")) {
                        HStack {
                            Text("Email:")
                                .bold()
                            Spacer()
                            Text(user.email)
                                .scaledToFit()
                        }
                        HStack {
                            Text("Username:")
                                .bold()
                            Spacer()
                            Text(user.username)
                        }
                        Button(action: { self.changePW = true },
                               label: {
                                Text("Change Password")
                                    .bold()
                               })
                            .fullScreenCover(isPresented: $changePW, content: {
                                ChangePassword()
                                .environmentObject(modelData)
                            })

                    }
                    Section(header: Text("Preferences")) {
                        HStack {
                            ForEach(user.preferences, id: \.self) { pref in
                                Image(systemName: pref.image)
                                    .foregroundColor(.black)
                            }
                        }
                    }
                    
                    Section(header: Text("Created")) {
                        VStack(alignment: .leading) {
                            Text("Your Events")
                                .font(.title2)
                                .padding(.leading, 15)
                                .padding(.top, 5)
                                
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(alignment: .top, spacing: 0) {
                                    ForEach(modelData.events) { event in
                                        if(event.createdBy == user.username) {
                                            NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData), label: {
                                                CatItem(event: event).environmentObject(modelData)
                                            })
                                            .navigationBarHidden(true)
                                        }
                                    }
                                }
                            }
                            .frame(height: 185)
                        }
                    }
                    Section(header: Text("Likes")) {
                        VStack(alignment: .leading) {
                            Text("Liked Events")
                                .font(.title2)
                                .padding(.leading, 15)
                                .padding(.top, 5)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(alignment: .top, spacing: 0) {
                                    ForEach(modelData.events) { event in
                                        ForEach(user.likedEvents, id: \.self) { like in
                                            if(event.objId == like) {
                                                NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData), label: {
                                                    CatItem(event: event).environmentObject(modelData)
                                                })
                                                .navigationBarHidden(true)

                                            }
                                        }
                                    }
                                }
                            }
                            .frame(height: 185)
                        }
                    }
                    
                }
                Spacer()
                Button(action: {
                    UserDefaults.standard.set(NSDictionary(), forKey: "user")
                    UserDefaults.standard.set(0, forKey: "loggedIn")
                    self.active = true
                    
                    },
                       label: {
                        Text("Log Out")
                            .padding()
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                            .foregroundColor(.white)
                            .cornerRadius(40)
                    })
            }
            .padding(.horizontal)
            .fullScreenCover(isPresented: $active, content: {
                    login()
            })
            .navigationBarHidden(true)
        }
    }
}

struct Profile_Previews: PreviewProvider {
    static var previews: some View {
        Profile()
            .environmentObject(ModelData())
    }
}


