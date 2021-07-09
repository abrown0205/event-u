import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { useState, useEffect } from 'react';
import "../css/map.css";
import { Room, Star } from '@material-ui/icons'
import axios from 'axios';
// import { format } from "timeago.js";