/**
 * Created by 93 on 5/18/17.
 */
import Realm from 'realm';
import PillModel from './PillModel';


let repository = new Realm({
    schema:[{
        name:'Pill',
        properties:{
            ID:{type:'string'},
            feedDeliveryId :'int',
            JSON :'string'
        }
    }]
});

let PillLocalService = {
    findAll: function() {
        let Pills = repository.objects('Pill');
        let sortedPills = Pills.sorted('feedDeliveryId',true);
        return sortedPills.map((obj) => { return JSON.parse(obj.JSON); });
    },
    save: function(Pills) {

        repository.write(() => {
            Pills.map(function (obj){
                let pill = new PillModel(obj.id.toString(),obj.feedDeliveryId,JSON.stringify(obj))
                if (!repository.objects('Pill').filtered("feedDeliveryId = '" + pill.feedDeliveryId + "'").length)
                    repository.create('Pill',pill );
                console.log("pill Add to realm: " + obj.id)
            })
        })
    },
    deleteAll:function () {
        repository.write(() => {
            repository.deleteAll();
            let count = repository.objects('Pill').length;
            console.log("count after reset Database: " + count)
        });
    },
    updatePill: function(Pill, callback) {
        let PillsWithSameId = repository.objects('Pill').filtered("ID = '" + Pill.ID + "'").snapshot();
        if (!callback) return;
        repository.write(() => {
            callback();
            for (let i = 0, len = PillsWithSameId.length; i < len; i++) {
                PillsWithSameId[i].JSON = Pill.JSON;
            }
            // repository.objects('Pill').filtered("ID = '" + Pill.ID + "'").map(function(p) {
            //         p.JSON = Pill.JSON;
            //         return p;
            //     }
            //
            // );
        });
    }
}

module.exports = PillLocalService;
// let repository = new Realm({
//     schema: [{
//         name: 'Todo',
//         primaryKey: 'id',
//         properties: {
//             id: {type: 'string', indexed: true},
//             title: 'string',
//             completed: 'bool',
//             createdAt: 'date',
//             updatedAt: 'date'
//         }
//     }]
// });
//
// let TodoService = {
//     findAll: function(sortBy) {
//         if (!sortBy) sortBy = [['completed', false], ['updatedAt', true]];
//         return repository.objects('Todo').sorted(sortBy);
//     },
//
//     save: function(todo) {
//         if (repository.objects('Todo').filtered("title = '" + todo.title + "'").length) return;
//
//         repository.write(() => {
//             todo.updatedAt = new Date();
//             repository.create('Todo', todo);
//         })
//     },
//
//     update: function(todo, callback) {
//         if (!callback) return;
//         repository.write(() => {
//             callback();
//             todo.updatedAt = new Date();
//         });
//     }
// };
//
// TodoService.save(new TodoModel('Hello Koding'));
// TodoService.save(new TodoModel('Make a Todo App with React Native'));
// TodoService.save(new TodoModel('Check to complete a todo'));
// TodoService.save(new TodoModel('Long press, drag and drop a todo to sort'));
// TodoService.save(new TodoModel('Save data with Realm'));
// TodoService.save(new TodoModel('Sync data with Firebase'));
//
// module.exports = TodoService;
