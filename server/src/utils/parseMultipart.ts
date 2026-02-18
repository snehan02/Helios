import busboy from 'busboy';
import { Request } from 'express';

interface FileUpload {
    fieldname: string;
    filename: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
}

interface ParsedMultipart {
    fields: Record<string, string>;
    files: FileUpload[];
}

export const parseMultipart = (req: Request): Promise<ParsedMultipart> => {
    return new Promise((resolve, reject) => {
        const bb = busboy({ headers: req.headers });
        const fields: Record<string, string> = {};
        const files: FileUpload[] = [];

        bb.on('file', (name, file, info) => {
            const { filename, encoding, mimeType } = info;
            const chunks: Buffer[] = [];

            file.on('data', (data) => {
                chunks.push(data);
            }).on('close', () => {
                files.push({
                    fieldname: name,
                    filename,
                    encoding,
                    mimetype: mimeType,
                    buffer: Buffer.concat(chunks),
                });
            });
        });

        bb.on('field', (name, val) => {
            fields[name] = val;
        });

        bb.on('close', () => {
            resolve({ fields, files });
        });

        bb.on('error', (err) => {
            reject(err);
        });

        req.pipe(bb);
    });
};
