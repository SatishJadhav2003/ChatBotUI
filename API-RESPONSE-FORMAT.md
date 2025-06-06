# Chart Data API Response Format Handling

## Problem
The backend API is returning `chart_data` as a JSON string instead of a proper object, which needs to be parsed on the frontend.

## Solution
The `ChatService` now includes automatic parsing of stringified JSON in API responses.

## API Response Examples

### Example 1: Frontend Chart (String Format from API)
```json
{
  "status": "valid",
  "message": null,
  "sql_query": "SELECT product_name, SUM(sales) as total_sales FROM sales GROUP BY product_name",
  "insight": "Sales analysis shows strong performance across categories...",
  "data": [...],
  "chart_data": "{\"render_mode\":\"frontend\",\"chart_type\":\"bar\",\"chart_config\":{\"labels\":[\"Product A\",\"Product B\"],\"datasets\":[{\"label\":\"Sales\",\"data\":[100,200]}]"
}
```

### Example 2: Backend Chart (String Format from API)
```json
{
  "status": "valid",
  "message": null,
  "sql_query": "SELECT category, COUNT(*) FROM products GROUP BY category",
  "insight": "Category distribution analysis...",
  "data": [...],
  "chart_data": "{\"render_mode\":\"backend\",\"chart_type\":\"image\",\"chart_config\":{\"image_data\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==\",\"alt_text\":\"Category Chart\",\"title\":\"Product Categories\"}}"
}
```

## Parsing Implementation

The `ChatService.parseApiResponse()` method automatically:

1. **Detects String Format**: Checks if `chart_data` is a string
2. **Parses JSON**: Safely converts the JSON string to an object
3. **Validates Structure**: Ensures the parsed data matches expected ChartData interface
4. **Error Handling**: Gracefully handles malformed JSON with detailed logging
5. **Fallback**: Removes invalid chart_data to prevent rendering errors

## Usage

No changes needed in components - the parsing is transparent:

```typescript
// Component code remains the same
this.chatService.sendMessage(query).subscribe(response => {
  // response.chart_data is now properly parsed object
  console.log(response.chart_data); // Object, not string
});
```

## Validation

The parser validates:
- ✅ `render_mode` is 'frontend' or 'backend'
- ✅ `chart_type` is valid for frontend charts
- ✅ `chart_config` exists and has required properties
- ✅ Backend charts have `image_data`
- ✅ Frontend charts have proper `datasets` and `labels`

## Error Handling

If parsing fails:
- 🚨 Warning logged to console with details
- 🛡️ chart_data removed from response to prevent crashes
- 📊 Data table and insights still display normally
- 🔄 User can retry without application errors

## Testing

Use the demo mode to verify chart rendering still works, then test with your real API:

```typescript
// In chat.service.ts
private demoMode = false; // Set to false for real API testing
```

Your API responses will now be automatically parsed regardless of whether chart_data comes as a string or object!
