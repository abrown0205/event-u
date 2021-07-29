//
//  EventCal.swift
//  eventU
//
//  Created by Alexandra Brown on 6/30/21.
//

import SwiftUI

struct EventCal: View {
    @EnvironmentObject var modelData: ModelData
    
    @Environment(\.calendar) var calendar
    @State var showingDayView = false
    @State var components = DateComponents()
    @State var desiredDate = Date()
    @State var date: Date
    
  private var monthly: DateInterval {
    calendar.dateInterval(of: .month, for: date)!
}
 

  var body: some View {
    VStack {
        HStack {
            Button(action: { self.changeMonth(month: -1)}, label: {
                Text("Previous")
                    .foregroundColor(.black)
            })
            Spacer()
            Button(action: { self.changeMonth(month: 1)}, label: {
                Text("Next")
                    .foregroundColor(.black)
            })
        }
        .padding()
        ScrollView{
        Text(DateFormatter.localizedString(from: self.calendar.date(from: self.components)!, dateStyle: .short, timeStyle: .short))
            .hidden()
        CalendarView(interval: monthly) { date in
            Text("30")
                .hidden()
                .padding(8)
                .background(Color.yellow)
                .clipShape(Circle())
                .padding(.vertical, 4)
                .overlay(
                    Text(String(self.calendar.component(.day, from: date)))
                        .foregroundColor(.black)
                  .onTapGesture {
                        self.showingDayView.toggle()
                        
                    self.components.month = self.calendar.component(.month, from: date)
                    self.components.day = self.calendar.component(.day, from: date)
                    self.components.year = self.calendar.component(.year, from: date)
                    
                    
                    }.sheet(isPresented: self.$showingDayView) {
                        DayView(date: self.calendar.date(from: self.components) ?? Date())
                            .environmentObject(modelData)
                  }
              )
          }
        }
        .padding()
    }
  }
    private func changeMonth(month: Int) {
        if let date = calendar.date(byAdding: .month, value: month, to: date) {
            self.date = date
        }
    }
}

struct EventCal_Previews: PreviewProvider {
    static var previews: some View {
        EventCal(date: Date())
    }
}
