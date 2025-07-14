# Database Benchmark App

A Next.js application for benchmarking and querying ClickHouse databases with real-time analytics and performance monitoring.

## Features

- **SQL Query Console** - Execute dynamic SQL queries against ClickHouse via API
- **Real-time Results** - View query results in formatted tables
- **Performance Metrics** - Track query execution times and history
- **Transaction Analytics** - Pre-built queries for transaction data analysis
- **S3 Data Loading** - Scripts to load data from S3 buckets to ClickHouse

## Quick Start

### Prerequisites
- Node.js 18+
- Kubernetes cluster with ClickHouse deployed
- AWS S3 bucket with transaction data

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### API Configuration

The app connects to your ClickHouse API service:
```
POST http://k8s-default-apiingre-e27345915c-694881870.ap-southeast-1.elb.amazonaws.com/calculation
Content-Type: application/json
{"query": "SELECT COUNT(*) FROM transactions.daily_transactions"}
```

## Data Loading

### Load S3 Data to ClickHouse

1. Configure AWS credentials in `key.csv`:
```csv
Access key ID,Secret access key
YOUR_ACCESS_KEY,YOUR_SECRET_KEY
```

2. Run the data loading script:
```bash
./run-load.sh
```

This creates the `transactions_db.transactions` table and loads CSV data from S3.

## Usage

### Query Console
- Enter SQL queries in the console
- Use sample queries for common operations
- View results in formatted tables
- Track performance metrics and history

### Sample Queries
- **Count Transactions**: `SELECT COUNT(*) FROM transactions.daily_transactions`
- **Transaction Summary**: Group by transaction type with totals
- **Top Merchants**: Most active merchants by transaction count

## Database Schema

```sql
CREATE TABLE transactions_db.transactions (
    transaction_id String,
    account_id String,
    transaction_type String,
    amount Int64,
    currency String,
    merchant_name String,
    category String,
    status String,
    balance_after Int64,
    location String,
    transaction_time String,
    _path LowCardinality(String),
    _file LowCardinality(String),
    _size Nullable(UInt64),
    _time Nullable(DateTime)
) ENGINE = MergeTree()
ORDER BY (transaction_id, account_id)
```

## API Response Format

Expected API response:
```json
{
  "data": [{"COUNT()": 2350000}],
  "rows": 1,
  "status": "success"
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Database**: ClickHouse
- **Cloud**: AWS S3, Kubernetes
- **Data Processing**: Python, boto3, pandas