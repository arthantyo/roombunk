/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package staycay.email;

import org.springframework.stereotype.Service;

import staycay.models.Reservation;

@Service
class EmailService{ 
    public void sendReservationConfirmationEmail(Reservation reservation) {
        // Implement the logic to send a reservation confirmation email
        System.out.println("Sending reservation confirmation email for reservation ID: " + reservation.getId());
    }

}
