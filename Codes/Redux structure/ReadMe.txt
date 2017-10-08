This is redux stucture Example Code.

In Redux,Application State is maintained in centralized store.

When User perform any action,That action trigger Perticular action(Action Type) with its payload(Action Data),
According to that action type Reducer methods are called which update store data.

Everytime when reducer update store data,That changes reflect on every scene,where that data is used.

In This Case,Booking Forms is the UserScreen,From that user trigger action,
According to that action Method of booking reducer is called and datas are updated.
