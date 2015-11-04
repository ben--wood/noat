(function () {
    'use strict';

    angular
      .module('app')
      .controller('NoteListController', NoteListController);

    NoteListController.$inject = ['$log', '$scope', '$state', '$cordovaClipboard', '$cordovaToast', 'noteService'];

    function NoteListController($log, $scope, $state, $cordovaClipboard, $cordovaToast, noteService) {
      var vm = this;
      vm.notes = [];
      vm.showDelete = false;   
      vm.showReorder = false;
      
      vm.copyToClipboard = copyToClipboard;
      vm.deleteNote = deleteNote;
      vm.getNotes = getNotes;
      vm.goAddNote = goAddNote;
      vm.goEditNote = goEditNote;
      vm.moveItem = moveItem;
      
      ////////////
      
      function copyToClipboard(note) {
        $cordovaClipboard
          .copy(note.text)
          .then(function () {
            $cordovaToast
              .show('Note copied to clipboard', 'short', 'bottom')
              .then(function(success) {
                console.log(success, 'copied to clipboard');
              }, function (error) {
                console.error(error, 'copied to clipboard but couldn\'t notify user');
              });
            
          }, function () {
            console.error('couldn\'t copy to clipboard');
          });
      }
      
      function deleteNote(id) {        
        noteService.remove(id).then(function() {      
          getNotes();
        });            
      }
      
      function getNotes() {      
        noteService.getAll().then(function(results) {              
          vm.notes = results;
        });        
      }
      
      function goAddNote() {
        $state.go('noteadd');
      }
      
      function goEditNote(id) {
        $state.go('noteedit', { id: id });
      }
      
      function moveItem(fromIndex, toIndex) {
        noteService.reorder(vm.notes[fromIndex], vm.notes[toIndex]).then(function() {              
          getNotes();
        });        
      }
      
      $scope.$on('$ionicView.enter', function () {            
        getNotes();            
      });      
    }
})();