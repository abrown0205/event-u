//
//  CatItem.swift
//  eventU
//
//  Created by Alexandra Brown on 7/8/21.
//

import SwiftUI

struct CatItem: View {
    var event: Event
    
    var body: some View {
        VStack {
            Text(event.title)
            HStack {
                Text(DateFormatter.localizedString(from: event.startTime, dateStyle: .short, timeStyle: .short))
            }
        }
        .frame(width: 155, height: 155, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
        .background(Color.yellow)
        .foregroundColor(.black)
        .cornerRadius(10)
        .padding(15)
    }
    
}

struct CatItem_Previews: PreviewProvider {
    static var previews: some View {
        CatItem(event: Event.default)
    }
}
