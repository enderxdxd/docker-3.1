# GitHub Secrets Setup Guide

This guide shows you exactly how to configure the GitHub Secrets needed for automated EC2 deployment.

## Required Secrets

You need to add **3 secrets** to your GitHub repository:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `EC2_HOST` | EC2 public IP address | `54.123.45.67` |
| `EC2_USERNAME` | SSH username | `ubuntu` |
| `EC2_KEY` | Private SSH key content | `-----BEGIN RSA PRIVATE KEY-----...` |

## Step-by-Step Instructions

### Step 1: Get Your EC2 Information

After launching your EC2 instance, collect:

1. **Public IP Address** - Found in EC2 console under instance details
2. **Private Key File** - The `.pem` file you downloaded when creating the instance

### Step 2: Access GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button

### Step 3: Add EC2_HOST Secret

- **Name:** `EC2_HOST`
- **Secret:** Your EC2 public IP address (just the IP, no http://)
  ```
  54.123.45.67
  ```
- Click **Add secret**

### Step 4: Add EC2_USERNAME Secret

- **Name:** `EC2_USERNAME`
- **Secret:** `ubuntu`
- Click **Add secret**

### Step 5: Add EC2_KEY Secret

This is the most important one. You need the **entire content** of your `.pem` file.

**On Windows (PowerShell):**
```powershell
Get-Content path\to\your-key.pem | clip
```

**On Windows (Command Prompt):**
```cmd
type path\to\your-key.pem
```

**On Mac/Linux:**
```bash
cat path/to/your-key.pem
```

Copy the **entire output**, including:
- `-----BEGIN RSA PRIVATE KEY-----`
- All the encoded content
- `-----END RSA PRIVATE KEY-----`

Then:
- **Name:** `EC2_KEY`
- **Secret:** Paste the entire private key content
- Click **Add secret**

### Step 6: Verify Secrets

After adding all three secrets, you should see:

```
EC2_HOST        Updated X seconds ago
EC2_KEY         Updated X seconds ago
EC2_USERNAME    Updated X seconds ago
```

## Important Notes

⚠️ **Security Warnings:**
- Never commit your `.pem` file to Git
- Never share your private key
- Keep your `.pem` file in a secure location
- GitHub Secrets are encrypted and only visible to GitHub Actions

✅ **Verification:**
- Secret names must be EXACTLY as shown (case-sensitive)
- EC2_HOST should be just the IP, no `http://` or port numbers
- EC2_KEY must include the BEGIN and END lines
- No extra spaces or newlines at the beginning/end

## Testing Your Secrets

After adding secrets, test by pushing to main:

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

Then:
1. Go to **Actions** tab
2. Watch the workflow run
3. If it fails at the SSH step, double-check your secrets

## Common Issues

### Issue: "Permission denied (publickey)"
**Solution:** EC2_KEY is incorrect or incomplete
- Make sure you copied the entire key including BEGIN/END lines
- Verify no extra characters were added

### Issue: "Connection timeout"
**Solution:** EC2_HOST is incorrect or security group blocks SSH
- Verify the IP address is correct
- Check EC2 security group allows SSH (port 22)

### Issue: "Host key verification failed"
**Solution:** Add this to your workflow (already included in deploy.yml):
```yaml
script: |
  export DOCKER_HOST=
  # Your deployment commands
```

## Updating Secrets

To update a secret:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on the secret name
3. Click **Update secret**
4. Enter new value
5. Click **Update secret**

## Deleting Secrets

To delete a secret:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on the secret name
3. Click **Remove secret**
4. Confirm deletion

---

**Next Steps:** After setting up secrets, follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to complete your deployment.
