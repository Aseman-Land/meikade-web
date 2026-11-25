const convertPersianToEnglishDigits = (input: string): string => {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

    let result = input;

    for (let i = 0; i < 10; i++) {
        result = result
            .replace(persianNumbers[i], i.toString())
            .replace(arabicNumbers[i], i.toString());
    }

    return result;
};

const numToString = (num: number): string => {
    const num_str: string = num.toString();
    var res: string = '';
    for (var i = 0; i < num_str.length; i++) {
        if (i > 0 && i % 3 == 0)
            res = ',' + res;
        res = num_str[num_str.length - i - 1] + res;
    }
    res = res.replaceAll('0', '۰');
    return res;
}

const processImage = (file: File, maxWidth = 1024, maxHeight = 1024): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context layout failed'));

                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas is empty'));
                        }
                    },
                    'image/jpeg',
                    0.7
                );
            };
        };

        reader.onerror = (error) => reject(error);
    });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { convertPersianToEnglishDigits, numToString, processImage, sleep };
