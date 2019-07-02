package app.web.simple.entity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import app.web.simple.util.CheckBookUploadDto;

@Entity
public class CheckBook {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Date occurringDate;

	private String account;

	private String category1;

	private String category2;

	private Double amount;

	private String type;

	private String purpose;

	private Integer checkNum;

	private String note;

	@ManyToOne
	@JoinColumn(name = "user_id")
	@NotNull
	private User user;

	@NotNull
	private Date createdDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getOccurringDate() {
		return occurringDate;
	}

	public void setOccurringDate(Date occurringDate) {
		this.occurringDate = occurringDate;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getCategory1() {
		return category1;
	}

	public void setCategory1(String category1) {
		this.category1 = category1;
	}

	public String getCategory2() {
		return category2;
	}

	public void setCategory2(String category2) {
		this.category2 = category2;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public Integer getCheckNum() {
		return checkNum;
	}

	public void setCheckNum(Integer checkNum) {
		this.checkNum = checkNum;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public static CheckBook map(CheckBookUploadDto dto) {
		CheckBook checkBook = new CheckBook();
		SimpleDateFormat formater = new SimpleDateFormat("MM/dd/yyyy");
		try {
			checkBook.setOccurringDate(formater.parse(dto.getDate()));
		} catch (ParseException e) {
			formater = new SimpleDateFormat("MM-dd-yyyy");
			try {
				checkBook.setOccurringDate(formater.parse(dto.getDate()));
			} catch (ParseException e1) {
				System.out.println("Error parsing date");
			}
		}
		checkBook.setAccount(dto.getAccount());
		String[] split = dto.getCategory().split(":");
		checkBook.setCategory1(split[0]);
		if (split.length > 1) {
			checkBook.setCategory2(split[1]);
		}
		checkBook.setAmount(dto.getAmount());
		checkBook.setType(dto.getType());
		checkBook.setPurpose(dto.getPayee());
		if (!dto.getCheckNumber().trim().equals("")) {
			checkBook.setCheckNum(Integer.parseInt(dto.getCheckNumber()));
		}
		checkBook.setNote(dto.getNote());
		checkBook.setCreatedDate(new Date());
		checkBook.setUser(dto.getUser());
		return checkBook;
	}

}
