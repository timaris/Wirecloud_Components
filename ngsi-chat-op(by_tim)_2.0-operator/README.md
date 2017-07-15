This is an operator developed to provide NGSI functionality to the basic-chat widget. It sends messages to a chat room using entities typed as ChatMessage, creating an instance per message. It also subscribes to such entities, sending them back to the widget for it to receive the messages.

Messages contain hash of the email of the sender (gravatar mail hash) and the text itself. The hash can be used to obtain the profile picture associated with the sender.

It is used by Basic Chat widget to connect to the chat room using wiring. Messages sent by the widget are received by this operator and published on the Context Broker, and messages received from the Context Broker subscription are sent back to the widget.

This version 2.0 is ready to be used in the Wirecloud mashup "archaelogical places-Crete" .

References
----------

* [FIWARE Lab's Data portal](https://data.lab.fiware.org)
* [WIRECLOUD Manual](https://wirecloud.readthedocs.io)
* [ORION BROKER Documentation](https://fiware-orion.readthedocs.io/en/develop/quick_start_guide/index.html)	
* [NGSI Documentation](http://fiware-orion.readthedocs.io/en/latest/user/walkthrough_apiv1/)
* [Github Repository of timaris](https://github.com/timaris/Wirecloud_Components/tree/master/ngsi-chat-op(by_tim)_2.0-operator)
* [Github Repository of CoNWet](https://github.com/wirecloud-fiware/quick-start-development-tutorial/tree/master/ngsi-chat-op)