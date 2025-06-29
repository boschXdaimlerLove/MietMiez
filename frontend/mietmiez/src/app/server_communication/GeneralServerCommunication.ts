export default class GeneralServerCommunication {
    // const url: string = 'https://mietmietz.de/v1';
    static serverSideUrl: string = 'http://backend:8080/v1'; // For docker development
    static clientSideUrl: string = GeneralServerCommunication.serverSideUrl;
}
