//
//  EventRow.swift
//  eventU
//
//  Created by Alexandra Brown on 6/28/21.
//

import SwiftUI

struct EventRow: View {
    var event: Event

    var body: some View {
            VStack {
                Text(event.title)
                HStack {
                    let cityState = event.city + ", " + event.state
                    Text(cityState)
                    Spacer()
                    Text(DateFormatter.localizedString(from: event.startTime, dateStyle: .medium, timeStyle: .short))
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
            .frame(minWidth: 0, maxWidth: .infinity)
            .background(Color.yellow)
            .foregroundColor(.black)

            .cornerRadius(10)
            .padding()
        
        Spacer()
    }
}


struct EventRow_Previews: PreviewProvider {
    static var events = ModelData().events
    
    static var previews: some View {
        EventRow(event: events[0])
    }
}

