import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileDetails } from '../models/file-details.model';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(
        private httpClient: HttpClient,
        private environment: EnvService
    ) { }


    upload(file: File): Observable<FileDetails> {
        const token = sessionStorage.getItem("token");
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.httpClient.post<FileDetails>(`${this.environment.apiURL}/file-upload/image`, formData, { headers: headers });
    }

    uploadImage(file: File): Observable<any>{
        const token = sessionStorage.getItem("token");
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        const formData: FormData = new FormData();
        formData.append('imageFile', file, file.name);
        return this.httpClient.post(`${this.environment.apiURL}/image/upload`, formData, { headers: headers });
    
    }
}
