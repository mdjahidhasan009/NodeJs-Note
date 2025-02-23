import 'reflect-metadata';

import { container, injectable, inject } from 'tsyringe';

@injectable()
class ApiService {
    constructor(@inject('Config') private config: { apiUrl: string}) {}

    fetchData() {
        console.log(`Fetching data from ${this.config.apiUrl}`);
    }
}

const config = { apiUrl: 'https://api.example.com' }; //
container.register('Config', { useValue: config });

const apiService = container.resolve(ApiService);
apiService.fetchData(); //Fetching data from https://api.example.com

// replace the value of apiUrl
config.apiUrl = 'https://api2.example.com';
container.register('Config', { useValue: config });
const apiService2 = container.resolve(ApiService);

apiService2.fetchData();
apiService.fetchData();