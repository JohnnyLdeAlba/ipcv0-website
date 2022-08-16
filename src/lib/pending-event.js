import { t_subscriptions } from "./subscriptions";

export class t_pending_event extends t_subscriptions {

  eventId;
  resourceId;

  actionEvent;
  processEvent;
  cancelEvent;
  
  constructor() {
   
    super();

    this.eventId = "";
    this.resourceId = 0;

    this.actionEvent = (payload) => { return true; };
    this.processEvent = (payload) => { return true; };
    this.cancelEvent = (payload) => { return true; };
  }

  set(eventId, resourceId) {
  
    this.eventId = eventId;
    this.resourceId = resourceId;
  }

  action(payload) {

    if (this.actionEvent(payload))
      return

    const pendingEvent = this;
    this.createEventSubscriber(

      this.eventId,
      this.resourceId,
      (payload) => { pendingEvent.process(payload); }
    );
  }

  process(payload) {

    if (this.resourceId == 0)
      return;

    if (this.processEvent(payload)) {

      const pendingEvent = this;
      this.createEventSubscriber(

        this.eventId,
	this.resourceId,
	(payload) => { pendingEvent.process(payload); }
      );
    }
  }

  cancel() {

    this.resourceId = 0;
    this.cancelEvent();
  }
}

