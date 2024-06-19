class Instance 
{
    constructor(ClassName = "Instance", Parent = null) 
    {
        this.ClassName = ClassName;
        this.Name = "Instance";
        this.Parent = Parent;
        this.Children = [];
    }

    addChild(child) 
    {
        this.Children.push(child);
        child.Parent = this;
    }

    removeChild(child) 
    {
        const index = this.Children.indexOf(child);
        if (index !== -1) {
            this.Children.splice(index, 1);
            child.Parent = null;
        }
    }

    getFullName()
    {
        let name = this.Name;
        let current = this.Parent;

        while (current) {
            name = current.Name + "." + name;
            current = current.Parent;
        }

        return name;
    }

    IsA(Class)
    {
        return this.ClassName == Class;
    }

}