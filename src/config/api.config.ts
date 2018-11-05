
import { HttpHeaders } from '@angular/common/http';

export class ApiConfig {

    // Header for API request
    public static HTTP_HEADERS = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8081/*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
            'Access-Control-Allow-Credentials': 'true'
        })
    };


    // API URLs
    public static TASK_API_URL = 'http://localhost:8081/api/task/';
    public static USER_API_URL = 'http://localhost:8081/api/user/';
    public static PROJECT_API_URL = 'http://localhost:8081/api/project/';


}