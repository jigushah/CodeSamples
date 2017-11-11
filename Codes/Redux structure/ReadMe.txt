This is redux stucture example code.

In Redux, application State is maintained in centralized store.

When user performs any action, that action triggers particular action(Action Type) with its payload(Action Data),
According to that action type reducer methods are called which updates store data.

Everytime when reducer updates store data, changes are reflected on every scene, where that data is used.

In this case, Booking Forms is the UserScreen, From that user triggers action, according to that action Method of booking reducer is called and datas are updated.
