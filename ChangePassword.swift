//
//  ChangePassword.swift
//  eventU
//
//  Created by Alexandra Brown on 7/24/21.
//

import SwiftUI
import Alamofire

struct ChangePassword: View {
    
    @EnvironmentObject var modelData: ModelData
    
    @State private var curPW: String = ""
    @State private var newPW: String = ""
    
    @State private var active: Bool = false
    @State private var updateFail: Bool = false
    
    var body: some View {
        NavigationView {
            VStack {
                HStack {
                    Image(systemName: "chevron.left")
                        .foregroundColor(.blue)
                    NavigationLink(
                        destination: tabs(tabNum: 2).environmentObject(modelData),
                        label: {
                            Text("Back")
                        }
                    )
                    Spacer()
                }
                .padding()
                Spacer()
                Text("Change Password")
                    .font(.title)
                    .bold()
                Spacer()
                Form {
                    SecureField("Current Password", text: $curPW)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    SecureField("New Password", text: $newPW)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    Button(action: {
                        let oldPW = getStoredPassword(account: modelData.user.username)
                        if oldPW == curPW {
                            updateAPI()
                        } else {
                            updateFail = true
                        }
                    },
                        label: {
                        Text("Update Password")
                            .padding()
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                            .foregroundColor(.white)
                            .cornerRadius(40)
                    })
                    .fullScreenCover(isPresented: $active, content: {
                        login()
                })
                    if updateFail == true {
                        Text("Error updating password. Please try again.")
                            .foregroundColor(.red)
                    }
                    Spacer()
                }
                .padding()
                .navigationBarHidden(true)
            }
        }
    }
    
    func getStoredPassword(account: String) -> String {
        let kcw = KeychainWrapper()
        if let password = try? kcw.getGenericPasswordFor(
            account: account,
            service: "unlockPassword") {
            return password
        }
        return ""
    }
    
    struct Payload: Encodable {
        var firstName: String
        var lastName: String
        var email: String
        var username: String
        var password: String
    }
    struct EditUser: Encodable {
        var _id: String
        var profile: Payload
    }
    
    func updateAPI() {
        let payload = Payload.init(firstName: modelData.user.firstName, lastName: modelData.user.lastName, email: modelData.user.email, username: modelData.user.username, password: newPW)
        
        let ed = EditUser.init(_id: modelData.user.objId, profile: payload)
        AF.request("https://event-u.herokuapp.com/api/users/editUser",
                    method: .post,
                    parameters: ed,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                        if response.response?.statusCode != 200 {
                            updateFail = true
                        }
                }
        
        UserDefaults.standard.set(NSDictionary(), forKey: "user")
        UserDefaults.standard.set(0, forKey: "loggedIn")
        self.active = true
    }
}

struct ChangePassword_Previews: PreviewProvider {
    static var previews: some View {
        ChangePassword()
            .environmentObject(ModelData())
    }
}
