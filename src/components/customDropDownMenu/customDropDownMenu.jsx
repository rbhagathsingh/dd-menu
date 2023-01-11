import React from 'react';
import BodyContent from '../bodyContent';
import Utils from '../time-utils';
import './customDropDownMenu.scss';

function getSelector(ele, attr) {
	let targetEle = null;
	if(typeof ele === 'string') {
		return ele;
	}
	if(ele instanceof Node){ 
		if(ele.className || attr === 'class') {
			targetEle = '.'+ele.className.replaceAll(' ', '.');
		}
		if(ele.id || attr === 'id') {
			targetEle = '#' + ele.id;
		}
		if((!ele.className && !ele.id) || attr === 'tag'){
			targetEle = ele.nodeName;
		}
	}
	return targetEle; 
}

class CustomDropdown extends React.Component {  
   
    constructor(props) {
      super(props);    
      this.state = {
        isOpen: false,
        labelItem: null,
        typeDropdown: null,
        menuWidth: 0,
        menuHeight: 0
      };
      this.buttonElement = null;
      this.openHideMenu = this.hideDropdown.bind(this);
      this.menuRef = React.createRef();
      this.menuBtnRef = React.createRef();
      this.parentScroll = this.parentScroll.bind(this);
    }
  
    componentWillMount() {
    //   const { label } = (this.props.list || [])[0];
    //   let firstItem = null;    
    //   if (typeof label != 'undefined') {
    //     this.checkType(false);
    //     firstItem = label;
    //   } else {
    //     this.checkType(true);
    //     firstItem = this.props.list[0];
    //   }        
    //   this.setState({
    //       labelItem: firstItem
    //   });    
    }
    checkType(value){
      this.setState({
          typeDropdown: value
      });    
    }

    applyPosition() {
      var elePos = this.menuBtnRef.current.offset();
      let pElemtPos = this.buttonElement || {
        scrollLeft: 0,
        scrollTop: 0
      };
      
      let leftPos = elePos.left > pElemtPos.scrollLeft ? elePos.left - pElemtPos.scrollLeft : pElemtPos.scrollLeft - elePos.left;
      let topPos = elePos.top > pElemtPos.scrollTop ? elePos.top - pElemtPos.scrollTop : pElemtPos.scrollTop - elePos.top;

      const { position } = this.props;
      let menuWid = 0;
      let menuH = 0;
      if(position === 'right bottom') {
        menuWid = this.menuRef.current.offsetWidth - this.menuBtnRef.current.offsetWidth;
      }
      if(position === 'right top') {
         menuWid = this.menuRef.current.offsetWidth - this.menuBtnRef.current.offsetWidth;
         menuH = (this.menuRef.current.offsetHeight  + this.menuBtnRef.current.offsetHeight + 2);
      }
      console.log('@@MENU',  this.menuRef.current.offsetHeight)
      this.menuRef.current.style.left = `${ leftPos - menuWid}px`;
      this.menuRef.current.style.top = `${(topPos + this.menuBtnRef.current.offsetHeight) - menuH}px`;
    }
    showDropdown(){
      this.menuRef.current.style.display = 'inline-block';
      this.removeParentScroll();
      this.setState((prev) => {
        const obj = {...prev};
        if(!obj.isOpen) {
            Utils.timeout('op-menu', () => {
                document.addEventListener("click", this.openHideMenu);
                this.initParentScroll();
                Utils.clearTimer('op-menu');
            }, 100);
        }
        obj.isOpen = true;
       
        

        return obj;
      });
      if(this.props.container === 'body') {
        console.log('Hi sHOW');
        this.applyPosition();
      }
      
    }

    hideDropdown (evt){
      var isVal = evt.target.closest(getSelector(this.menuRef.current));
      var isBtnVal = evt.target.closest(getSelector(this.menuBtnRef.current));
      let isAutoClose = (this.props.autoCloseMenu === undefined || this.props.autoCloseMenu === null) ? true : this.props.autoCloseMenu;
      if(isAutoClose) {
        this.closeMenu();
      }else {
        if(!isVal) {
          if(!(isBtnVal && evt.target.tagName.toLowerCase() === 'input')) {
            this.closeMenu();
          }
          
        }
      }
    }

    closeMenu() {
      this.menuRef.current.style.display = 'none';
      this.setState({ isOpen: false });
      Utils.timeout('op-menu1', () => {
        document.removeEventListener("click", this.openHideMenu);
        Utils.clearTimer('op-menu1');
      }, 100);
    }

    chooseItem(evt, value){    
      if (this.state.labelItem !== value) {
        this.setState({
          labelItem: value      
        });
      }
    }
    

    initParentScroll() {
      this.buttonElement = this.menuBtnRef.current.getScrollableParent();
      if(this.buttonElement) {
        this.buttonElement.addEventListener('scroll', this.parentScroll);
      }
    }

    removeParentScroll() {
      if(this.buttonElement) {
        this.buttonElement.removeEventListener('scroll', this.parentScroll);
      }
    }

    

    parentScroll() {
      this.closeMenu();
      Utils.timeout('scr-menu1', () => {
        if(this.props.container === 'body') {
          this.removeParentScroll();
        }
        Utils.clearTimer('scr-menu1');
      }, 200);
    }

    componentDidMount() {
      if(this.props.container === 'body') {
        this.initParentScroll();
      }
      
    }

    setPosition(position) {
      const menuCss = {};
      if(this.props.container === 'body') {
        return menuCss
      }
      if(position === 'left bottom') {
        menuCss.left = '0px';
        menuCss.top = '100%';
      }
      if(position === 'right bottom' ) {
        menuCss.right = '0px'
        menuCss.top = '100%';
      }

      if(position === 'left top') {
        menuCss.left = '0px';
        menuCss.bottom = '100%';
      }
      if(position === 'right top') {
        menuCss.right = '0px';
        menuCss.bottom = '100%';
      }
      return menuCss;
    }

    render () {
      const { children, renederLabel, position, className, isCaret, menuName, targetFormInput, container } = this.props;
      let caret = (isCaret === undefined || isCaret === null) ? true :  isCaret; 
      const menuCss = this.setPosition(position);

      return (
        <div className={`pp-dropdown ${this.state.isOpen ? 'open' : ''} ${className ? ' '+ className : ''}`}>
          {!targetFormInput && (
            <span className="pp-dropdown-toggle" ref={this.menuBtnRef} onClick={this.showDropdown.bind(this)}>
              {renederLabel && renederLabel()}
              {menuName && (
                <span>{menuName}</span>
              )}
              {caret && (
                <span className="caret-block">
                    <span className="caret"></span>
                </span>
              )}
            </span>
          )}
          {targetFormInput && (
            <span className="pp-dropdown-toggle" ref={this.menuBtnRef}>
              {renederLabel && renederLabel()}
              {menuName && (
                <span>{menuName}</span>
              )}
              {caret && (
                <span className="caret-block">
                    <span className="caret"></span>
                </span>
              )}
            </span>
          )}
          {container === 'body' && (
            <BodyContent>
            <div className={`pp-dropdown-menu${this.state.isOpen ? ' open' : ''}`} style={menuCss} ref={this.menuRef}>
              {children}
            </div>
          
          </BodyContent>
          )}
           {container !== 'body' && (
           <div className="pp-dropdown-menu" style={menuCss} ref={this.menuRef}>
              {children}
            </div>
           )}
          
         
          
      </div>
      )
    }
  }

  export default CustomDropdown;