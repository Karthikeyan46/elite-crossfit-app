# How to Set Up EmailJS for your Free Trial Form

To get the Free Trial form to send emails directly to your inbox, you need to create a free account on EmailJS and get your setup keys. Follow these quick steps:

## Step 1: Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up for a free account.

## Step 2: Add an Email Service
1. On the EmailJS dashboard, click on **Email Services** on the left menu.
2. Click **Add New Service**.
3. Select your email provider (e.g., Gmail, Outlook).
4. Connect your account and click **Create Service**.
5. **Important:** Copy the **Service ID** (it usually looks like `service_xxxxx`).

## Step 3: Create your Email Templates
You should create **two** different templates to distinguish between Free Trial requests and general contact messages.

### Template 1: Free Trial
1. Click on **Email Templates** -> **Create New Template**.
2. **Subject:** `New Free Trial Lead: {{from_name}}`
3. **Content:** 
   ```
   You have a new lead for a Free Trial!
   
   Name: {{from_name}}
   Mobile: {{from_mobile}}
   Email: {{reply_to}}
   ```
4. Save and copy the **Template ID** to `VITE_EMAILJS_TEMPLATE_ID`.

### Template 2: Contact Form
1. Click **Create New Template** again.
2. **Subject:** `New Website Message: {{subject}}`
3. **Content:** 
   ```
   You have a new message from your website!
   
   From: {{from_name}} ({{from_email}})
   Subject: {{subject}}
   Message: {{message}}
   ```
4. Save and copy the **Template ID** to `VITE_EMAILJS_TEMPLATE_ID_CONTACT`.

## Step 4: Get your Public Key
1. Click on **Account** on the left menu.
2. Under the API Keys section, copy your **Public Key**.

## Step 5: Update your `.env` file
1. In your project, open the `.env` file (it is located in the root folder `gym-app/.env`).
2. Paste the three keys you copied into their respective spots:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```
3. Save the `.env` file.

## Step 6: Restart your server
Since we added environment variables (`.env`), you need to restart your terminal running `npm run dev`. 
- Go to the terminal where `npm run dev` is running, press `Ctrl + C` to stop it, and then run `npm run dev` again.

Once you restart, your Free Trial form will start sending emails directly to you!
