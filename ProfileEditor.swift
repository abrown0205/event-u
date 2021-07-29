//
//  ProfileEditor.swift
//  eventU
//
//  Created by Alexandra Brown on 7/19/21.
//

import SwiftUI

struct ProfileEditor: View {
    @EnvironmentObject var modelData: ModelData
    @Binding var profile: User
    
    @State private var showCatSheet: Bool = false
    @State private var changePW: Bool = false
    @ObservedObject var cats = Categories()
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Login Information")) {
                    HStack {
                        Text("First Name").bold()
                        Divider()
                        TextField("First Name", text: $profile.firstName)
                    }
                    HStack {
                        Text("Last Name").bold()
                        Divider()
                        TextField("Last Name", text: $profile.lastName)
                    }
                    HStack {
                        Text("Email").bold()
                        Divider()
                        TextField("Email", text: $profile.email)
                            .autocapitalization(.none)
                    }
                    HStack {
                        Text("Username").bold()
                        Divider()
                        TextField("Username", text: $profile.username)
                            .autocapitalization(.none)
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
                    Button(action: {
                        self.showCatSheet.toggle()
                    }) {
                        HStack {
                            Text("Choose Categories")
                                .bold()
                            Spacer()
                            Image(systemName: "chevron.right")
                                .foregroundColor(Color(UIColor.systemGray4))
                                .font(Font.body.weight(.medium))
                        }
                    }
                    .sheet(isPresented: $showCatSheet) {
                        MultiSelect(profile: $profile).navigationBarHidden(true)
                            .environmentObject(modelData)
                    }
                    /*Toggle(isOn: .constant(false), label: {
                        Text("Push Notifications")
                    })*/
                }
            }
            .navigationBarHidden(true)
        }
    }
}

struct ProfileEditor_Previews: PreviewProvider {
    static var previews: some View {
        ProfileEditor(profile: .constant(.default))
    }
}
