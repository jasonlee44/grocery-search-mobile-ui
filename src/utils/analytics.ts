type AnalyticsEvent =
  | 'search_submitted'
  | 'filter_applied'
  | 'deal_viewed'
  | 'saved_deal'
  | 'retailer_clicked';

// Maps each event to its required properties — enforced at call sites via the generic constraint
type EventProperties = {
  search_submitted:  { query: string; resultCount: number };
  filter_applied:    { filterType: string; filterValue: string };
  deal_viewed:       { productId: string; productName: string; retailer: string };
  saved_deal:        { productId: string; productName: string; price: number };
  retailer_clicked:  { retailer: string; productId: string };
};

const eventLog: { event: string; properties: object; timestamp: string }[] = [];

export function track<E extends AnalyticsEvent>(event: E, properties: EventProperties[E]) {
  const entry = { event, properties, timestamp: new Date().toISOString() };
  eventLog.push(entry);
  console.log('[Analytics]', entry);
}

export function getEventLog() {
  return [...eventLog];
}