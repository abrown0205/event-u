//
//  AttendedButton.swift
//  eventU
//
//  Created by Alexandra Brown on 7/18/21.
//

import SwiftUI

struct AttendedButton: View {
    @EnvironmentObject var modelData: ModelData
    @State var event: Event
    @Binding var isSet: Bool
    
    var body: some View {
        Button(action: {
            isSet.toggle()
            if isSet {
                modelData.user.attendedEvents.append(event.objId)
            } else {
                modelData.user.attendedEvents.removeAll(where: {$0 == event.objId})
            }
        }) {
            Image(systemName: isSet ? "checkmark.seal.fill" : "checkmark.seal")
                .foregroundColor(isSet ? Color.green : Color.gray)
        }
    }
}

struct AttendedButton_Previews: PreviewProvider {
    static var previews: some View {
        AttendedButton(event: Event.default, isSet: .constant(true))
    }
}
