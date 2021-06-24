package star.astro.chat.service;

import com.alibaba.fastjson.JSONObject;
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

    public JSONObject getTime() {
        JSONObject ret = new JSONObject();
        NTP_Client.NTP_Timestamp_Data NTPTimestamp = ntp_client.Get_NTP_Timestamp();
        ret.put("simpleFormat", String.format("%02d:%02d:%02d", NTPTimestamp.lHour, NTPTimestamp.lMinute, NTPTimestamp.lSecond));
        ret.put("UnixTime", NTPTimestamp.lUnixTime * 1000);
        return ret;
    }

    public String getUnixTime() {
        NTP_Client.NTP_Timestamp_Data NTPTimestamp = ntp_client.Get_NTP_Timestamp();
        return String.valueOf(NTPTimestamp.lUnixTime * 1000);
    }

}
