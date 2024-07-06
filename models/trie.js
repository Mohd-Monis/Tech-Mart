class TrieNode{
    data;
    ptrs;
    isEnd;
    constructor(c){
       this.data = c;
       this.ptrs = [];
       for(let i = 0; i < 26; i++){
        this.ptrs.push(null);
       }
       this.isEnd = true;
    }

    insert(str){

    }
    insertUtil(str,i,TrieNode){
        if(i == str.length){
            this.isEnd = true;
            return;
        }

        char_ix = str[i] - 'a';
        if(this.ptrs[char_ix] === null){
            this.ptrs[char_ix ] = new TrieNode(str[i]);
        } 
        insert(str,i+1,this.ptrs[char_ix]);
    }
}


let node = new TrieNode('a');
console.log(node.ptrs);