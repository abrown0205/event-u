//
//  Event.swift
//  eventU
//
//  Created by Alexandra Brown on 6/28/21.
//

import Foundation
import SwiftUI

struct Event: Hashable, Codable, Identifiable {
    var id: Int
    var objId: String
    var title: String
    var category: Category
    var name: String
    var street: String
    var city: String
    var state: String
    var lat: Double
    var long: Double
    var startTime: Date
    var endTime: Date
    var description: String
    var likes: Int
    var createdBy: String
    var capacity: String
    var deleted: Int
    
    static let `default` = Event(id: 0, objId: "60e05d9b93ea063127da6ddc", title: "concert", category: Category.music, name: "UCF", street: "4405 central florida blvd", city: "orlando", state: "florida", lat: 28.58609, long: -81.194122, startTime: Date(), endTime: Date(), description: "a concert", likes: 4, createdBy: "abrown", capacity: "20", deleted: 0)
    
}

