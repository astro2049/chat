package star.astro.chat.service;

import org.springframework.stereotype.Service;
import star.astro.chat.TimeServiceClient_Library.NTP_Client;

import java.util.LinkedList;
import java.util.List;

@Service
public class TimeService {

    private final NTP_Client ntp_client;

    private final List<String> NTPServerList;

    public TimeService() {
        ntp_client = new NTP_Client();
        NTPServerList = new LinkedList<>();
        initializeNTPServerList();
        if (!ntp_client.CreateSocket()) {
            ntp_client.CloseSocket();
        }
        setupNTPServerAddress(NTPServerList.get(0)); // hacky
    }

    private void initializeNTPServerList() {
        this.NTPServerList.add("time.windows.com");
    }

    private void setupNTPServerAddress(String url) {
        ntp_client.SetUp_TimeService_AddressStruct(url);
    }

    public String getTime() {
        NTP_Client.NTP_Timestamp_Data NTPTimestamp = ntp_client.Get_NTP_Timestamp();
        return String.format("%02d:%02d:%02d", NTPTimestamp.lHour, NTPTimestamp.lMinute, NTPTimestamp.lSecond);
    }

}
