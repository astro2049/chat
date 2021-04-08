/*	File			NTP_Client.java
	Purpose			Network Time Protocol (NTP) Client - Library
	Author			Richard Anthony	(ar26@gre.ac.uk)
	Date			February 2015
*/
package star.astro.chat.TimeServiceClient_Library;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.URL;

public class NTP_Client {

    private static int NTP_Port = 123;
    private static int NTP_PACKET_SIZE = 48;// NTP time stamp is in the first 48 bytes of the message
    private static long SeventyYears = 2208988800L;  // Number of seconds in 70 years.
    // The raw timestamp is the number of seconds Since 1900
    // Unix time starts on Jan 1 1970 (70 years = 2208988800 seconds)
    DatagramSocket m_TimeService_Socket;
    InetAddress m_TimeService_IPAddress;
    Boolean m_bNTP_Client_Started;
    private Boolean m_bTimeServiceAddressSet;

    public NTP_Client() {
        m_bTimeServiceAddressSet = false;
        m_bNTP_Client_Started = false;
    }

    public enum NTP_Client_ResultCode {NTP_Success, NTP_ServerAddressNotSet, NTP_SendFailed, NTP_ReceiveFailed}

    public final class NTP_Timestamp_Data {
        public NTP_Client_ResultCode eResultCode;
        public long lUnixTime;    // Seconds since 1970 (secsSince1900 - seventyYears)
        public long lHour;
        public long lMinute;
        public long lSecond;

        NTP_Timestamp_Data() {
            eResultCode = NTP_Client_ResultCode.NTP_ServerAddressNotSet; // Use as default for construction (gets overwritten)
            lHour = 0;
            lMinute = 0;
            lSecond = 0;
            lUnixTime = 0;
        }
    }

    public Boolean CreateSocket() {
        try {
            m_TimeService_Socket = new DatagramSocket();
            m_TimeService_Socket.setSoTimeout(500); // Timeout = 500ms (i.e. non blocking IO behaviour)
            // The timeout period was chosen so as to prevent the application freezing if the time service does not respond
            // but that it waits long enough for the reply RTT , so that it mostly avoids missing an actual reply
            // Tested with the following values: 100ms(can work but unreliable)
            // 200ms(generally ok but highly dependent on network RTT) 400ms(generally reliable) 500ms(adds margin of safety)
        } catch (SocketException Ex) {
            return false;
        }
        return true;
    }

    public InetAddress SetUp_TimeService_AddressStruct(String sURL) {
        String sFullURL = "http://" + sURL;
        try {
            m_TimeService_IPAddress = InetAddress.getByName(new URL(sFullURL).getHost());
            m_bTimeServiceAddressSet = true;
        } catch (Exception Ex) {
            return null;
        }
        return m_TimeService_IPAddress;
    }

    public int GetPort() {
        return NTP_Port;
    }

    public NTP_Timestamp_Data Get_NTP_Timestamp() {
        NTP_Timestamp_Data NTP_Timestamp = new NTP_Timestamp_Data();
        if (true == m_bTimeServiceAddressSet) {
            if (true == Send_TimeService_Request()) {   // Send operation succeeded
                NTP_Timestamp = Receive(NTP_Timestamp);
                if (0 != NTP_Timestamp.lUnixTime) {
                    NTP_Timestamp.eResultCode = NTP_Client_ResultCode.NTP_Success; // Signal that the NTP_Timestamp has been updated with valid content
                    return NTP_Timestamp;
                }
                NTP_Timestamp.eResultCode = NTP_Client_ResultCode.NTP_ReceiveFailed; // Signal that the receive operation failed (Time server did not reply)
                return NTP_Timestamp;
            }
            NTP_Timestamp.eResultCode = NTP_Client_ResultCode.NTP_SendFailed; // Signal that the send operation failed (Time server was not contacted)
            return NTP_Timestamp;
        }
        NTP_Timestamp.eResultCode = NTP_Client_ResultCode.NTP_ServerAddressNotSet; // Signal that Time server address has not been set, cannot get NTP timestamp
        return NTP_Timestamp;
    }

    Boolean Send_TimeService_Request() {
        byte[] bSendBuf = new byte[NTP_PACKET_SIZE]; // Zero-out entire 48-byte buffer to hold incoming packets (UTC time value)
        // Initialize values needed to form NTP request
        bSendBuf[0] = (byte) 0xE3;// 0b11100011;
        // LI bits 7,6		= 3 (Clock not synchronised),
        // Version bits 5,4,3	= 4 (The current version of NTP)
        // Mode bits 2,1,0	= 3 (Sent by client)

        try {
            DatagramPacket SendPacket = new DatagramPacket(bSendBuf, bSendBuf.length,
                    m_TimeService_IPAddress /*The address to send to*/, NTP_Port);
            m_TimeService_Socket.send(SendPacket);
        } catch (SocketTimeoutException Ex) {
            return false;
        } catch (Exception Ex) {
            System.out.printf("Send failed: %s\n", Ex.toString());
            return false;
        }
        return true;
    }

    private NTP_Timestamp_Data Receive(NTP_Timestamp_Data NTP_Timestamp) {
        byte[] bRecvBuf = new byte[NTP_PACKET_SIZE]; // buffer to hold incoming packets (UTC time value)
        DatagramPacket RecvPacket = new DatagramPacket(bRecvBuf, NTP_PACKET_SIZE);
        try {
            m_TimeService_Socket.receive(RecvPacket);
        } catch (Exception ex) {
            NTP_Timestamp.lUnixTime = 0; // Signal that an error occurred
            return NTP_Timestamp;
        }

        if (0 < RecvPacket.getLength()) {   // The timestamp starts at byte 40 of the received packet and is four bytes,
            long l1 = (long) bRecvBuf[40] & 0xFF;
            long l2 = (long) bRecvBuf[41] & 0xFF;
            long l3 = (long) bRecvBuf[42] & 0xFF;
            long l4 = (long) bRecvBuf[43] & 0xFF;
            long secsSince1900 = (l1 << 24) + (l2 << 16) + (l3 << 8) + l4;
            NTP_Timestamp.lUnixTime = secsSince1900 - SeventyYears;    // Subtract seventy years
            NTP_Timestamp.lHour = (long) (NTP_Timestamp.lUnixTime % 86400L) / 3600;
            NTP_Timestamp.lMinute = (long) (NTP_Timestamp.lUnixTime % 3600) / 60;
            NTP_Timestamp.lSecond = (long) NTP_Timestamp.lUnixTime % 60;
        } else {
            NTP_Timestamp.lUnixTime = 0; // Signal that an error occurred
        }
        return NTP_Timestamp;
    }

    public Boolean Get_ClientStarted_Flag() {
        return m_bNTP_Client_Started;
    }

    public void Set_ClientStarted_Flag(Boolean bClient_Started) {
        m_bNTP_Client_Started = bClient_Started;
    }

    public void CloseSocket() {
        try {
            m_TimeService_Socket.close();
        } catch (Exception Ex) {   // Generic approach to dealing with situations such as socket not created
        }
    }

}
