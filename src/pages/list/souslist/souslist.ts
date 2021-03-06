import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
    selector: 'page-souslist',
    templateUrl: 'souslist.html'
})
export class SousListPage {
    //menu principale
    ListeMenu: FirebaseListObservable<any>;
    //sous menu
    MonSousMenu: FirebaseListObservable<any>;
    db: AngularFireDatabase;
    titre: any

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, db: AngularFireDatabase) {
        // If we navigated to this page, we will have an item available as a nav param
        // a chaque fois que l'on arrive sur cette page, on est sur le menu classique donc pas de sous menu
        this.titre = navParams.get('menuTitre');
        this.ListeMenu = db.list(navParams.get('name'));
        this.db = db;
    }

    /**
     * Méthode qui ajoute un élément a une liste
     */
    addTodoMenu() {
        let prompt = this.alertCtrl.create({
            title: 'Tâche',
            message: "Entrez un nom pour cette tâche : ",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'tâche'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.ListeMenu.push({
                            title: data.title,
                            //si true, alors sous menu, sinon menu principale
                            isSousMenu: true,
                            checked: false
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    /**
     * méthode appelé lorsque l'on clique sur un sousMenu <br/>
     * Affiche les différents options : modifié/supprimé/Annuler
     * @param itemId  : id de l'item
     * @param itemTitle : titre de l'item
     * @param isSousMenu : boolean qui définis si oui ou non c'est un sous menu
     */
    showOptions(itemId, itemTitle, isSousMenu) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Que voulez-vous faire ?',
            buttons: [
                {
                    text: 'Supprimer',
                    role: 'destructive',
                    handler: () => {
                        this.removeTodo(itemId);
                    }
                }, {
                    text: 'Modifier',
                    handler: () => {
                        this.updateTodo(itemId, itemTitle);
                    }
                }, {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    checkboxChecked(itemId, isChecked) {
        isChecked = !isChecked;
        this.ListeMenu.update(itemId, {
            checked: isChecked
        });
    }

    /**
     * supprime l'item de la listeMenu
     * @param itemId : id de l'item
     */
    removeTodo(itemId: string) {
        this.ListeMenu.remove(itemId);
    }

    /**
     * Met a jour un item de la liste
     * @param itemId : id de l'item
     * @param itemTitle : titre de l'item
     */
    updateTodo(itemId, itemTitle) {
        let prompt = this.alertCtrl.create({
            title: 'Todo Name',
            message: "Update the name for this todo",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'title',
                    value: itemTitle
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.ListeMenu.update(itemId, {
                            title: data.title
                        });
                    }
                }
            ]
        });
        prompt.present();
    }
}
