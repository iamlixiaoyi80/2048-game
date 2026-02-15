using UnityEngine;

/// <summary>
/// 玩家控制器 - 处理玩家输入和移动
/// </summary>
public class PlayerController : MonoBehaviour
{
    [Header("移动参数")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;

    [Header("地面检测")]
    [SerializeField] private Transform groundCheck;
    [SerializeField] private float groundDistance = 0.2f;
    [SerializeField] private LayerMask groundLayer;

    private Rigidbody2D rb;
    private bool isGrounded;
    private float horizontalMove;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // 读取输入
        horizontalMove = Input.GetAxisRaw("Horizontal");

        // 跳跃输入
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            Jump();
        }
    }

    void FixedUpdate()
    {
        // 应用移动
        Move(horizontalMove * Time.fixedDeltaTime);
    }

    void Move(float direction)
    {
        Vector2 velocity = new Vector2(direction * moveSpeed, rb.velocity.y);
        rb.velocity = velocity;
    }

    void Jump()
    {
        rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
        isGrounded = false;
    }

    void FixedUpdate()
    {
        // 地面检测
        isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundDistance, groundLayer);

        // 翻转角色
        if (horizontalMove > 0)
            transform.localScale = new Vector3(1, 1, 1);
        else if (horizontalMove < 0)
            transform.localScale = new Vector3(-1, 1, 1);
    }
}
