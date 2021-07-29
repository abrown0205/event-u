//
//  ChangePassword.swift
//  eventU
//
//  Created by Alexandra Brown on 7/6/21.
//

import SwiftUI
import Alamofire

struct ResetPassword: View {
    @EnvironmentObject var modelData: ModelData
    @State private var username = ""
    @State private var active: Bool = false
    @State private var emailFail: Bool = false
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Password Reset")
                    .font(.title)
                    .bold()
                Spacer()
                Text("Enter username to send a new password.")
                TextField("Username", text: $username)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                Button(action: {
                    emailAPI()
                    },
                       label: {
                        Text("Send Email")
                            .padding()
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                            .foregroundColor(.white)
                            .cornerRadius(40)
                    })
                .fullScreenCover(isPresented: $active, content: {
                    login()
                        .environmentObject(ModelData())
            })
                if emailFail == true {
                    Text("Error sending email. Please try again.")
                }
                Spacer()
            }
            .padding()
            //.navigationBarHidden(true)
        }
    }
    
    struct Email: Encodable {
        var username: String
        var firstName: String
        var lastName: String
        var email: String
        var activationCode: Int
    }
    func emailAPI() {
        let user = modelData.user
        let mail = Email.init(username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, activationCode: user.activationCode)
        AF.request("https://event-u.herokuapp.com/api/users/sendPasswordResetEmail",
                   method: .post,
                   parameters: mail,
                   encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                    if response.response?.statusCode == 200 {
                        self.active = true
                    } else {
                        self.emailFail = true
                    }
                }
    }
}

struct ResetPassword_Previews: PreviewProvider {
    static var previews: some View {
        ResetPassword()
            .environmentObject(ModelData())
    }
}
