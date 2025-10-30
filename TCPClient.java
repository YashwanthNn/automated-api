import java.net.*;

public class TCPClient {
    public static void main(String[] args) throws Exception {
        DatagramSocket socket = new DatagramSocket(4000);
        byte[] buffer = new byte[1024];
        System.out.println("UDP Client ready... waiting for messages...");

        while (true) {
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            socket.receive(packet);
            String msg = new String(packet.getData(), 0, packet.getLength());
            System.out.println("Received: " + msg);
        }
    }
}
