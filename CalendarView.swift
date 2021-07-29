//
//  CalendarView.swift
//  eventU
//
//  Created by Alexandra Brown on 7/3/21.
//

import SwiftUI

fileprivate extension DateFormatter {
    static var month: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM"
        return formatter
    }

    static var monthAndYear: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        return formatter
    }
}

fileprivate extension Calendar {
    func generateDates(
        inside interval: DateInterval,
        matching components: DateComponents
    ) -> [Date] {
        var dates: [Date] = []
        dates.append(interval.start)

        enumerateDates(
            startingAfter: interval.start,
            matching: components,
            matchingPolicy: .nextTime
        ) { date, _, stop in
            if let date = date {
                if date < interval.end {
                    dates.append(date)
                } else {
                    stop = true
                }
            }
        }

        return dates
    }
}

struct DayView: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    @EnvironmentObject var modelData: ModelData
  
    var date: Date
    private var eventCount: Int {
        var counter = 0
        let cal = Calendar.current
        let events = modelData.events
        
        for event in events {
            let eventComp = cal.dateComponents([.month, .day, .year], from: event.startTime)
            let dayComp = cal.dateComponents([.month, .day, .year], from: self.date)
            
            if eventComp == dayComp {
                counter += 1
            }
        }
        return counter
    }
    
    var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return formatter
    }
    
    
    var body: some View {
        NavigationView {
            let events = modelData.events
            let cal = Calendar.current
            VStack {
                HStack {
                    Text(self.dateFormatter.string(from: self.date))
                        .font(.title)
                        .bold()
                    Spacer()
                    Button("Close") {
                    self.presentationMode.wrappedValue.dismiss()
                    }
                }
                .padding()
                Divider()
                ScrollView {
                    ForEach(events) { event in
                        let eventComp = cal.dateComponents([.month, .day, .year], from: event.startTime)
                        let dayComp = cal.dateComponents([.month, .day, .year], from: self.date)
                        if eventComp == dayComp {
                            NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                EventRow(event: event)
                            }
                        }
                    }
                    
                    if eventCount == 0 {
                        Text("No Events Today")
                    }
                }
                Spacer()
            }
            .navigationBarHidden(true)
        }
    }
}


    struct WeekView<DateView>: View where DateView: View {
        @Environment(\.calendar) var calendar

        let week: Date
        let content: (Date) -> DateView

        init(week: Date, @ViewBuilder content: @escaping (Date) -> DateView) {
            self.week = week
            self.content = content
        }

        private var days: [Date] {
            guard
                let weekInterval = calendar.dateInterval(of: .weekOfYear, for: week)
                else { return [] }
            return calendar.generateDates(
                inside: weekInterval,
                matching: DateComponents(hour: 0, minute: 0, second: 0)
            )
        }

        var body: some View {
            HStack {
                ForEach(days, id: \.self) { date in
                    HStack {
                        if self.calendar.isDate(self.week, equalTo: date, toGranularity: .month) {
                            self.content(date)
                        } else {
                            self.content(date).hidden()
                        }
                    }
                }
            }
        }
    }

    struct MonthView<DateView>: View where DateView: View {
        @Environment(\.calendar) var calendar

        let month: Date
        let showHeader: Bool
        let content: (Date) -> DateView

        init(
            month: Date,
            showHeader: Bool = true,
            @ViewBuilder content: @escaping (Date) -> DateView
        ) {
            self.month = month
            self.content = content
            self.showHeader = showHeader
        }

        private var weeks: [Date] {
            guard
                let monthInterval = calendar.dateInterval(of: .month, for: month)
                else { return [] }
            return calendar.generateDates(
                inside: monthInterval,
                matching: DateComponents(hour: 0, minute: 0, second: 0, weekday: calendar.firstWeekday)
            )
        }

        private var header: some View {
            let component = calendar.component(.month, from: month)
            let formatter = component == 1 ? DateFormatter.monthAndYear : .month
            return Text(formatter.string(from: month))
                .font(.title)
                .padding()
        }

        var body: some View {
            VStack {
                if showHeader {
                    header
                }

                ForEach(weeks, id: \.self) { week in
                    WeekView(week: week, content: self.content)
                }
            }
        }
    }

    struct CalendarView<DateView>: View where DateView: View {
        @Environment(\.calendar) var calendar

        let interval: DateInterval
        let content: (Date) -> DateView

        init(interval: DateInterval, @ViewBuilder content: @escaping (Date) -> DateView) {
            self.interval = interval
            self.content = content
        }

        private var months: [Date] {
            calendar.generateDates(
                inside: interval,
                matching: DateComponents(day: 1, hour: 0, minute: 0, second: 0)
            )
        }

        var body: some View {
            ScrollView(.vertical, showsIndicators: false) {
                VStack {
                    ForEach(months, id: \.self) { month in
                        MonthView(month: month, content: self.content)
                    }
                }
            }
        }
    }

    struct RootView: View {
        @Environment(\.calendar) var calendar
        var date: Date

        private var year: DateInterval {
            calendar.dateInterval(of: .month, for: date)!
        }

        var body: some View {
            CalendarView(interval: year) { date in
                Text("30")
                    .hidden()
                    .padding(8)
                    .background(Color.black)
                    .clipShape(Circle())
                    .padding(.vertical, 4)
                    .overlay(
                        Text(String(self.calendar.component(.day, from: date)))
                            .foregroundColor(.white)
                    )
            }
        }
    }


    struct root_Previews: PreviewProvider {
        static var previews: some View {
            DayView(date: Date())
                .environmentObject(ModelData())
        }
    }
