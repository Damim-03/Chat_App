# استخدم Node.js الرسمي
FROM node:18

# أنشئ مجلد للعمل
WORKDIR /app

# انسخ package.json + package-lock.json
COPY package*.json ./

# نزّل الـ dependencies
RUN npm install

# انسخ باقي ملفات المشروع
COPY . .

# افتح البورت
EXPOSE 5000

# شغّل السيرفر
CMD ["npm", "run", "dev"]
