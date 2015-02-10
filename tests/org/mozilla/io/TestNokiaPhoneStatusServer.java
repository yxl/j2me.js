package org.mozilla.io;

import java.io.*;
import javax.microedition.io.*;
import com.nokia.mid.s40.io.LocalMessageProtocolMessage;
import com.nokia.mid.s40.io.LocalMessageProtocolConnection;
import com.nokia.mid.s40.codec.DataEncoder;
import com.nokia.mid.s40.codec.DataDecoder;
import gnu.testlet.TestHarness;
import gnu.testlet.Testlet;

public class TestNokiaPhoneStatusServer implements Testlet {
    public int getExpectedPass() { return 27; }
    public int getExpectedFail() { return 0; }
    public int getExpectedKnownFail() { return 0; }
    LocalMessageProtocolConnection client;
    static final String PROTO_NAME = "nokia.phone-status";

    public void testProtocolVersion(TestHarness th) throws IOException {
        DataEncoder dataEncoder = new DataEncoder("Conv-BEB");
        dataEncoder.putStart(14, "event");
        dataEncoder.put(13, "name", "Common");
        dataEncoder.putStart(14, "message");
        dataEncoder.put(13, "name", "ProtocolVersion");
        dataEncoder.put(10, "version", "1.[0-10]");
        dataEncoder.putEnd(14, "message");
        dataEncoder.putEnd(14, "event");
        byte[] sendData = dataEncoder.getData();
        client.send(sendData, 0, sendData.length);

        LocalMessageProtocolMessage msg = client.newMessage(null);
        client.receive(msg);
        byte[] clientData = msg.getData();

        DataDecoder dataDecoder = new DataDecoder("Conv-BEB", clientData, 0, clientData.length);
        dataDecoder.getStart(14);
        String name = dataDecoder.getString(13);
        th.check(name, "Common");
        th.check(dataDecoder.getName(), "message");
        dataDecoder.getStart(14);
        String string2 = dataDecoder.getString(13);
        String string = string2 + ":" + dataDecoder.getString(10);
        dataDecoder.getEnd(14);
        th.check(string.startsWith("ProtocolVersion:"));
        th.check(string.indexOf(58) + 1 != -1);
        th.check(string.substring(string.indexOf(58) + 1).length() > 0);
    }

    public void testSubscribeMessages(TestHarness th) throws IOException {
        DataEncoder dataEncoder = new DataEncoder("Conv-BEB");
        dataEncoder.putStart(14, "event");
        dataEncoder.put(13, "name", "Query");
        dataEncoder.putStart(15, "subscriptions");
        dataEncoder.put(10, "battery", "CurrentStateOnly");
        dataEncoder.put(10, "wifi_status", "CurrentStateOnly");
        dataEncoder.put(10, "network_status", "CurrentStateOnly");
        dataEncoder.putEnd(15, "subscriptions");
        dataEncoder.putEnd(14, "event");
        byte[] sendData = dataEncoder.getData();
        client.send(sendData, 0, sendData.length);

        LocalMessageProtocolMessage msg = client.newMessage(null);
        client.receive(msg);
        byte[] clientData = msg.getData();

        DataDecoder dataDecoder = new DataDecoder("Conv-BEB", clientData, 0, clientData.length);
        dataDecoder.getStart(14);
        th.check(dataDecoder.getString(13), "Query");
        th.check(dataDecoder.getString(10), "OK");
        dataDecoder.getStart(15);

        int i = 0;
        while (dataDecoder.listHasMoreItems()) {
            String name = dataDecoder.getName();
            if (name.equals("battery")) {
                dataDecoder.getStart(14);
                th.check(dataDecoder.getInteger(2), 1);
                th.check(dataDecoder.getBoolean(), true);
                dataDecoder.getEnd(14);
            } else if (name.equals("network_status")) {
                dataDecoder.getStart(14);
                th.check(dataDecoder.getString(10), "Home");
                th.check(dataDecoder.getBoolean(), true);
                dataDecoder.getEnd(14);
            } else if (name.equals("wifi_status")) {
                dataDecoder.getStart(14);
                th.check(dataDecoder.getBoolean(), true);
                dataDecoder.getEnd(14);
            } else {
                th.fail("Unexpected name: " + name);
            }

            i++;
        }

        th.check(i, 3);

        dataDecoder.getEnd(15);
    }

    private native void sendFakeOnlineEvent();
    private native void sendFakeOfflineEvent();

    void testNotify(TestHarness th, boolean online) throws IOException {
        LocalMessageProtocolMessage msg = client.newMessage(null);
        client.receive(msg);
        byte[] clientData = msg.getData();

        DataDecoder dataDecoder = new DataDecoder("Conv-BEB", clientData, 0, clientData.length);
        dataDecoder.getStart(14);
        th.check(dataDecoder.getString(13), "ChangeNotify");
        dataDecoder.getString(10);
        dataDecoder.getStart(15);
        th.check(dataDecoder.getName(), "network_status");
        dataDecoder.getStart(14);
        th.check(dataDecoder.getString(10), "Home");
        th.check(dataDecoder.getBoolean(), online);
        dataDecoder.getEnd(14);
        dataDecoder.getEnd(15);

        msg = client.newMessage(null);
        client.receive(msg);
        clientData = msg.getData();

        dataDecoder = new DataDecoder("Conv-BEB", clientData, 0, clientData.length);
        dataDecoder.getStart(14);
        th.check(dataDecoder.getString(13), "ChangeNotify");
        dataDecoder.getString(10);
        dataDecoder.getStart(15);
        th.check(dataDecoder.getName(), "wifi_status");
        dataDecoder.getStart(14);
        th.check(dataDecoder.getBoolean(), online);
        dataDecoder.getEnd(14);
        dataDecoder.getEnd(15);
    }

    public void testChangeNotify(TestHarness th) throws IOException {
        DataEncoder dataEncoder = new DataEncoder("Conv-BEB");
        dataEncoder.putStart(14, "event");
        dataEncoder.put(13, "name", "Query");
        dataEncoder.putStart(15, "subscriptions");
        dataEncoder.put(10, "battery", "Disable");
        dataEncoder.put(10, "wifi_status", "Enable");
        dataEncoder.put(10, "network_status", "Enable");
        dataEncoder.putEnd(15, "subscriptions");
        dataEncoder.putEnd(14, "event");
        byte[] sendData = dataEncoder.getData();
        client.send(sendData, 0, sendData.length);

        sendFakeOnlineEvent();
        testNotify(th, true);

        sendFakeOfflineEvent();
        testNotify(th, false);
    }

    public void test(TestHarness th) {
       try {
            client = (LocalMessageProtocolConnection)Connector.open("localmsg://" + PROTO_NAME);

            testProtocolVersion(th);
            testSubscribeMessages(th);
            testChangeNotify(th);

            client.close();
       } catch (IOException ioe) {
            th.fail("Unexpected exception");
            ioe.printStackTrace();
       }
    }
}

