class t_subscriptions {

  events;
  subscriptions;

  constructor() {

    this.events = [];
    this.subscriptions = [];
  }

  createEvent(event_id) {
    this.events[event_id] = []; 
  }

  createSubscription(event_id) {
    this.subscriptions[event_id] = []; 
  }

  addEventSubscriber(event_id, subscriber_id, callback) {

    if (typeof this.events[event_id] == 'undefined')
      return;
    else if (typeof callback == 'undefined') {

      if (typeof this.events[event_id][subscriber_id] == 'undefined')
        return;

      delete this.events[event_id][subscriber_id];
      return
    }
    else if (typeof this.events[event_id][subscriber_id] == 'undefined')
      this.events[event_id][subscriber_id] = [];
    
    this.events[event_id][subscriber_id].push(callback);
  }

  addSubscriber(event_id, subscriber_id, callback) {

    if (typeof this.subscriptions[event_id] == 'undefined')
      return;
    else if (typeof callback == 'undefined') {

      if (typeof this.subscriptions[event_id][subscriber_id] == 'undefined')
        return;

      delete this.subscriptions[event_id][subscriber_id];
      return
    }
    else if (typeof this.subscriptions[event_id][subscriber_id] == 'undefined')
      this.subscriptions[event_id][subscriber_id] = [];
    
    this.subscriptions[event_id][subscriber_id].push(callback);
  }

  removeSubscriber(event_id, subscriber_id) {
    this.addSubscriber(event_id, subscriber_id);
  }

  getEventSubscriber(event_id, subscriber_id) {

    if (typeof this.events[event_id] == 'undefined')
      return null;
    
    else if (typeof this.events[event_id][subscriber_id] == 'undefined')
      return null;

    return this.events[event_id][subscriber_id];
  }

  getSubscriber(event_id, subscriber_id) {

    if (typeof this.subscriptions[event_id] == 'undefined')
      return null;
    
    else if (typeof this.subscriptions[event_id][subscriber_id] == 'undefined')
      return null;

    return this.subscriptions[event_id][subscriber_id];
  }

  processEvent(event_id, payload) {

    if (typeof this.events[event_id] == 'undefined')
      return;

    let index;
    for (index = 0; index < this.events[event_id].length; index++) {
      this.events[event_id][index](payload);
    }
  }

  processSubscription(event_id, payload) {

    if (typeof this.subscriptions[event_id] == 'undefined')
      return;

    Object.values(this.subscriptions[event_id])
      .forEach((subscriber) => {

        Object.values(subscriber)
          .forEach((callback) => {
            callback(payload);
          });
      });
  }

  removeEventSubscriber(event_id, subscriber_id) {
    this.addSubscriber(event_id, subscriber_id);
  }
}

export function createSubscriptions() {
  return new t_subscriptions;
}
