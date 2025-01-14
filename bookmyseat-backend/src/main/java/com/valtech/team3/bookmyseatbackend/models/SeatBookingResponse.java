package com.valtech.team3.bookmyseatbackend.models;

import java.util.List;

import com.valtech.team3.bookmyseatbackend.entities.Booking;
import com.valtech.team3.bookmyseatbackend.entities.Seat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SeatBookingResponse {
	List<Seat> availableSeats;
	List<Booking> preferredSeats;
	List<Booking> bookedSeats;
}