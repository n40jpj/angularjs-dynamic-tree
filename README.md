# AngularJS Dynamic Tree View #

##About this Project##

I was looking for a tree which did something like the http://www.jstree.com/ (you will notice that the css and theme is interchangeable), but I wanted an angular tree so I could do some of the really cool AngularJS two way binding, but to hook into the event driven system easily (not to mention being able to quickly update the tree results by filtering the source Json data - give it a go it rocks). I must stress that I have used a number of google search results to plan and implement this solution. I'm always looking to improve my code, so if I have missed something or dropped the ball somewhere please get in touch.

I have to give credit the people here <http://stackoverflow.com/questions/11854514/is-it-possible-to-make-a-tree-view-with-angular> as it's where I did a lot of my learning on this topic.

This is my first AngularJS open source project so please be gentle but if you have any comments I would love to get your feed back, please email <development@n40jpj.com>

##Overview##

The tree has been developed to include the most common features of a tree menu. This is open source so that you may add or remove features to suit your requirements.  Removing will speed the tree up further.

* Unlimited children
* Folder & Document Nodes
* Expanded nodes are only rendered in Html when the parent folder is expanded keeping the DOM as light weight as possible
* Menu reloads dont cause the folders to be resetSelectable folders and documents - tri state checkboxes
* Right click context menu
* Menu reloads dont cause the folders to be reset
* Thanks to it being built in AngularJS you can emit and catch events fired to / from elsewhere in your site (/$scope) I have some example of this for you.
* Dragging and Dropping of documents into folders
* Based on simple Json objects which can be expanded to include your own meta data
* As I have defined the html template in the Javascript file as a string then compiled it, the tree works a treat in IE8 (I'll wash my mouth out)
* It is stupidly easy to implement filters and search functionality which is lightning fast
* The expaned nodes are tracked so if you want to exand a number of nodes before loding the tree, the functionality is there.


##Supported browsers##

The Angular UI Tree is tested with the following browsers:

* Chrome (stable)
* Firefox
* IE 8, 9 and 10
* For IE8 support, make sure you do the following:
 * include an ES5 shim
 * make your AngularJS application compatible with Internet Explorer
 * use jQuery 1.x

##Using the Tree Module##

I have assumed that you have a base understanding of AngularJS.

I use a variant of this tree model in my day to day coding so if you have any questions about integrating into yor site please ask.

Documentation is light here, but only becasue I have a new born baby, and my time is devoted to her!!

###Adding the module into your project###

* Add the modules folder into your project, or everthing within it.
* In your index.html :
** Add modules/Tree/theme/style.css" rel="stylesheet"
** Add modules/Tree/treeModule.js
** Add modules/contextMenu/contextMenuModule.js"
* In your Add your DI for the treeModule e.g angular.module('myAppapp', ['treeModule']);


###Adding the tree node###
	<div class="tree node" id="documentTreeView" ng-if="treeViewJsonData" >
		<ul>
			<li tree class="tree" node="treeViewJsonData"></li>
		</ul>
	</div>


* treeViewJsonData is the populated Json $scope variable


###The Folder and Document Json shape###


	{
		"data": {
		"title": "Business"
		},
		"attr": {
            "documentId": 0,
            "href":'',
            "documentGroupId": 6702,
            "documentTypeId": 3,
            "selectable": true,
            "selected": 0,
            "expanded": false,
            "isEndNode": false,
            "show": true,
            "draft": false
		},
		"children": [
		{
			"data": {
			    "title": "Introduction To My Business"
			},
			"attr": {
                "documentId": 18101,
                "href":'',
                "documentGroupId": 6702,
                "documentTypeId": 2,
                "selectable": true,
                "selected": 0,
                "expanded": false,
                "isEndNode": true,
                "show": true,
                "draft": false
			},
			"children": null
		}
		]
	}

##Example Project##
I have included a very basic demonstration project with the source code, for you to have a play with.

##Planed Future Development##
* Addition of some angular transitions on the tree nodes, and for dragging and dropping.
* Better description of the factories and services I have implemented.
* Karma tests.

#Other Projects#
I tend to keep all of my projects, past and present at <http://development.n40jpj.com>
