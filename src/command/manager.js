function CommandManager(...commands) {
    this.cmds = [];
    commands.forEach(command => this.addCommand(command));
}

CommandManager.prototype.addCommand = function (command) {
    if (!command) return;

    let index = this.cmds.findIndex(cmd => cmd.name === command.name);
    if (index === -1) {
        this.cmds.push(command);
    } else {
        this.cmds.splice(index, 1, command);
    }
};

CommandManager.prototype.execute = function (query) {
    query = query.replace(":", "").trim();
    let [name, arg] = query.split(" ");
    let command = this.cmds.find(cmd => cmd.name === name);
    if (command) {
        let result = command.onExecute(arg);
        if (!result || result.length < 1) {
            result = command.onBlankResult(arg);
        }
        return result;
    } else {
        let list = this.cmds
            .map(cmd => {
                return {
                    content: `:${cmd.name}`,
                    description: `${c.match(":" + cmd.name)} - ${c.dim(cmd.description)}`
                }
            });

        let result = list.filter((item) => name && item.content.indexOf(name) > -1);
        if (result.length > 0) {
            // Filter commands with prefix
            return [
                {content: "", description: `Found following commands, press Tab to select.`},
                ...result
            ];
        } else {
            return [
                {content: "", description: `No ${c.match(":" + name)} command found, try following commands?`},
                ...list
            ];
        }
    }
};

CommandManager.prototype.handleCommandEnterEvent = function (content, disposition) {
    if (content) {
        content = content.replace(":", "").trim();
        let command = this.cmds.find(cmd => cmd.name === content);
        if (command) {
            command.onEnter(content, disposition);
        }
    }
}